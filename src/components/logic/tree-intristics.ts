import { IdType, TreeNode } from "./interfaces";

export function findItemById<T>(treeData: TreeNode<T>[], id?: IdType | null) {
  if(isNullOrUndefined(id)) return null;
  return treeData.find(n => n.id === id);
}
export function isNullOrUndefined(v: unknown) {
  return v === null || typeof(v) === "undefined";
}
export function findChildren<T>(treeData: TreeNode<T>[], parentId?: IdType | null) {
  return treeData.filter((n) => {
    return (isNullOrUndefined(parentId) 
      && isNullOrUndefined(n.parentId)) || (n.parentId === parentId)
  });
}
function getMaxPosition<T>(treeData: TreeNode<T>[], parentId?: IdType | null) {
  return Math.max(
    ...findChildren(treeData, parentId).map(node => node.position || 0),
    0
  );
}
function getAllExcept<T>(treeData: TreeNode<T>[], item: TreeNode<T>) {
  return treeData.filter(node => node.id !== item.id);
}
export function repositionItems<T>(treeData: TreeNode<T>[], 
  item: TreeNode<T>, itemTo: TreeNode<T> | null): 
  { updatedData: TreeNode<T>[], changedItems?: TreeNode<T>[] } {

  if(item === itemTo) return { updatedData: treeData };
  if(!item.canHaveParent && itemTo?.parentId) return { updatedData: treeData };
  const parent = findItemById(treeData, itemTo?.parentId);
  if(parent && (!parent.canHaveChildren)) return { updatedData: treeData };
  if(item.id === itemTo?.parentId) return { updatedData: treeData };
  
  let updatedData = getAllExcept(treeData, item);

  if (!itemTo || itemTo.position === undefined) {
    const maxLayerPosition = getMaxPosition(updatedData, itemTo?.parentId);
    item.position = maxLayerPosition + 1;
    item.parentId = itemTo?.parentId;
    updatedData.push(item);
  } else {
    // Recalculate positions for the sibling group (same parentId)
    const siblings = findChildren(updatedData, itemTo.parentId)
      .sort((a, b) => (a.position || 0) - (b.position || 0));
    const itemToIndex = siblings.findIndex(node => node.id === itemTo.id);
    
    // Place the item before itemTo
    item.position = itemTo.position;
    item.parentId = itemTo.parentId;

    // Insert item in the correct spot and adjust subsequent positions
    siblings.splice(itemToIndex, 0, item);

    // Re-assign positions for the reordered siblings
    siblings.forEach((node, index) => {
      node.position = index + 1;
    });

    // Merge siblings back into the updatedTreeData
    updatedData = updatedData.filter(node => node.parentId !== itemTo.parentId)
      .concat(siblings);
  }

  const changedItems = findChangedItems(treeData, updatedData);

  return { updatedData, changedItems };
}

export function findChangedItems<T>(treeData: TreeNode<T>[], updatedTreeData: TreeNode<T>[])
  : TreeNode<T>[] {

  const changedItems: TreeNode<T>[] = [];
  const originalNodesMap = new Map(treeData.map(node => [node.id, node]));

  for (const node of updatedTreeData) {
    const originalNode = originalNodesMap.get(node.id);
    if (
      !originalNode ||
      originalNode.position !== node.position ||
      originalNode.parentId !== node.parentId
    ) {
      changedItems.push(node);
    }
  }
  return changedItems;
}
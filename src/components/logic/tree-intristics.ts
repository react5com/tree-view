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
  item: TreeNode<T>, itemTo: TreeNode<T> | null): TreeNode<T>[] {
  // put item before itemTo,
  // if itemTo is null then send item to the end of the top layer
  //console.log("reposition", item, itemTo)

  if(item === itemTo) return treeData;
  if(!item.canHaveParent && itemTo?.parentId) return treeData;
  const parent = findItemById(treeData, itemTo?.parentId);
  if(parent && (!parent.canHaveChildren)) return treeData;
  if(item.id === itemTo?.parentId) return treeData;
  
  let updatedTreeData = getAllExcept(treeData, item);

  if (itemTo === null) {
    const maxLayerPosition = getMaxPosition(updatedTreeData, null);
    item.position = maxLayerPosition + 1;
    item.parentId = null;
    updatedTreeData.push(item);
  } else if (itemTo.position === undefined) {
    const maxLayerPosition = getMaxPosition(updatedTreeData, itemTo.parentId);
    item.position = maxLayerPosition + 1;
    item.parentId = itemTo.parentId;
    updatedTreeData.push(item);
  } else {
    // Recalculate positions for the sibling group (same parentId)
    const siblings = findChildren(updatedTreeData, itemTo.parentId)
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
    updatedTreeData = updatedTreeData.filter(node => node.parentId !== itemTo.parentId)
      .concat(siblings);
  }

  return updatedTreeData;
}
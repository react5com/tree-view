import clsx from 'clsx';
import './TreeView.css'
import { Fragment } from 'react/jsx-runtime';
import { useEffect, useMemo, useState, ReactNode, useRef } from 'react';
import { findChildren, findItemById, IdType, repositionItems, TreeNode, validateItems } from '../logic';
import { TreeViewItem } from '../TreeViewItem';

export interface ITreeViewProps<T = unknown> {
  className?: string;
  itemClassName?: string;
  items?: TreeNode<T>[];
  readonly?: boolean;
  onRenderItem?: (node: TreeNode<T>, level: number) => ReactNode;
  onPositionsUpdated?: (changedItems: TreeNode<T>[]) => void;
  onSelectionChanged?: (selectedItems: TreeNode<T>[]) => void;
}

export const TreeView = <T=unknown>({className, itemClassName, items, onRenderItem,
  onPositionsUpdated, onSelectionChanged, readonly = false}: ITreeViewProps<T>) => {
  const [treeData, setTreeData] = useState(items || [])
  useEffect(() => {
    if(items) {
      const error = validateItems(items);
      if (error) {
          console.error(error);
          throw new Error(error);
      }
    }
    setTreeData(items || []);
  }, [items]);  
  
  const rootNodes = useMemo(() => treeData ? findChildren(treeData, null) : [], [treeData]);
  
  const [draggedNodeId, setDraggedNodeId] = useState<IdType | null>(null);
  const [targetNodeId, setTargetNodeId] = useState<IdType | null>(null);

  const [selectedItems, setSelectedItems] = useState<IdType[] | null>(null);
  const previousSelectedItems = useRef<IdType[] | null>(null);

  const handleCheckboxChange = (id: IdType) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems?.includes(id)
        ? prevSelectedItems.filter((itemId) => itemId !== id)
        : [...(prevSelectedItems || []), id]
    );
  };
  useEffect(() => {
    if (previousSelectedItems.current === selectedItems) {
      return;
    }
    previousSelectedItems.current = selectedItems;
    if(onSelectionChanged) {
      const items = selectedItems 
        && selectedItems.map(id => findItemById(treeData, id)).filter(item => item != null);
      if(items !== null) onSelectionChanged(items);
    }
  }, [onSelectionChanged, treeData, selectedItems]);

  const completeMove = (targetNode?: TreeNode<T>) => {
    const draggedNode = draggedNodeId ? findItemById(treeData, draggedNodeId) : null;
    if(!draggedNode) return;
    const {updatedData, changedItems} = repositionItems(treeData, draggedNode, targetNode || null)
    setTreeData(updatedData);
    if(onPositionsUpdated && changedItems) onPositionsUpdated(changedItems);
  }
  return (
    <Fragment>
      <ul className={clsx("draggable-tree-view", className)}>
        <TreeViewItem
          className={itemClassName}
          draggedNodeId={draggedNodeId}
          targetNodeId={targetNodeId}
          setDraggedNodeId={setDraggedNodeId}
          setTargetNodeId={setTargetNodeId}
          selectedItems={selectedItems || []}
          readonly={readonly}
          node={null}
          childNodes={rootNodes}
          treeData={treeData}
          onCompleteMove={completeMove}
          level={-1}
          onRenderItem={onRenderItem}
          onSelected={handleCheckboxChange}
        />
      </ul>
    </Fragment>
  )
}
export default TreeView

import clsx from 'clsx';
import './TreeView.css'
import { Fragment } from 'react/jsx-runtime';
import { useEffect, useMemo, useState, ReactNode } from 'react';
import { findChildren, findItemById, IdType, repositionItems, TreeNode } from '../logic';
import { TreeViewItem } from '../TreeViewItem';

export interface ITreeViewProps<T = unknown> {
  className?: string;
  itemClassName?: string;
  items?: TreeNode<T>[];
  onRenderItem?: (node: TreeNode<T>, level: number) => ReactNode;
  onNodeUpdated?: (updatedNode: TreeNode<T>) => void;
  onPositionsUpdated?: (items?: TreeNode<T>[]) => void;
  onSelectionChanged?: (selectedItems: TreeNode<T>[]) => void;
}

export const TreeView = <T=unknown>(props: ITreeViewProps<T>) => {
  const [treeData, setTreeData] = useState(props.items || [])
  useEffect(() => {
    if(props.items)
      setTreeData(props.items);
  }, [props.items]);  
  
  const rootNodes = useMemo(() => treeData ? findChildren(treeData, null) : [], [treeData]);
  
  const [draggedNodeId, setDraggedNodeId] = useState<IdType|null>(null);
  const [targetNodeId, setTargetNodeId] = useState<IdType|null>(null);

  const [selectedItems, setSelectedItems] = useState<IdType[]>([]);
  const handleCheckboxChange = (id: IdType) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(id)
        ? prevSelectedItems.filter((itemId) => itemId !== id)
        : [...prevSelectedItems, id]
    );
  };
  const { onSelectionChanged } = props;
  useEffect(() => {
    if(onSelectionChanged) {
      const items = selectedItems 
        && selectedItems.map(id => findItemById(treeData, id)).filter(item => item != null);
      onSelectionChanged(items);
    }
  }, [onSelectionChanged, treeData, selectedItems]);

  const completeMove = (targetNode?: TreeNode<T>) => {
    const draggedNode = draggedNodeId ? findItemById(treeData, draggedNodeId) : null;
    if(!draggedNode) return;
    const updatedData = repositionItems(treeData, draggedNode, targetNode || null)
    setTreeData(updatedData);
    //console.log(updatedData)
    const updatedNode = findItemById(treeData, draggedNodeId);
    if(props.onNodeUpdated && updatedNode) props.onNodeUpdated(updatedNode);
    if(props.onPositionsUpdated) props.onPositionsUpdated(updatedData);
  }
  return (
    <Fragment>
      <ul className={clsx("draggable-tree-view", props.className)}>
        <TreeViewItem
          className={props.itemClassName}
          draggedNodeId={draggedNodeId}
          targetNodeId={targetNodeId}
          setDraggedNodeId={setDraggedNodeId}
          setTargetNodeId={setTargetNodeId}
          selectedItems={selectedItems}
          node={null}
          childNodes={rootNodes}
          treeData={treeData}
          onCompleteMove={completeMove}
          level={-1}
          onRenderItem={props.onRenderItem}
          onSelected={handleCheckboxChange}
        />
      </ul>
    </Fragment>
  )
}
export default TreeView

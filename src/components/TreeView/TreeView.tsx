import clsx from 'clsx';
import './TreeView.css'
import { Fragment } from 'react/jsx-runtime';
import { useEffect, useMemo, useState, ReactNode } from 'react';
import { findChildren, findItemById, IdType, repositionItems, TreeNode } from '../logic';
import { TreeViewItem } from '../TreeViewItem';

export interface ITreeViewProps {
  className?: string;
  itemClassName?: string;
  items?: TreeNode[];
  onRenderItem?: (node: TreeNode, level: number) => ReactNode;
  onNodeUpdated?: (updatedNode: TreeNode) => void;
  onPositionsUpdated?: (items?: TreeNode[]) => void;
}

export const TreeView = (props: ITreeViewProps) => {
  const [treeData, setTreeData] = useState(props.items || [])
  useEffect(() => {
    if(props.items)
      setTreeData(props.items);
  }, [props.items]);  
  
  const rootNodes = useMemo(() => treeData ? findChildren(treeData, null) : [], [treeData]);
  
  const [draggedNodeId, setDraggedNodeId] = useState<IdType|null>(null);
  const [targetNodeId, setTargetNodeId] = useState<IdType|null>(null);

  const completeMove = (targetNode?: TreeNode) => {
    const draggedNode = draggedNodeId ? findItemById(treeData, draggedNodeId) : null;
    if(!draggedNode) return;
    const updatedData = repositionItems(treeData, draggedNode, targetNode || null)
    setTreeData(updatedData);
    console.log(updatedData)
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
          node={null}
          childNodes={rootNodes}
          treeData={treeData}
          onCompleteMove={completeMove}
          level={0}
          onRenderItem={props.onRenderItem}
        />
      </ul>
    </Fragment>
  )
}
export default TreeView

import { DragEvent, Fragment, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { findChildren, IdType, TreeNode } from "../logic";
import clsx from "clsx";
import "./TreeViewItem.css"

interface ITreeViewItemProps {
  className?: string;
  node: TreeNode | null;
  treeData?: TreeNode[];
  childNodes?: TreeNode[];
  draggedNodeId: IdType | null;
  targetNodeId: IdType | null;
  setDraggedNodeId: (nodeId: IdType | null) => void;
  setTargetNodeId: (nodeId: IdType | null) => void;
  level: number;
  onCompleteMove: (node?: TreeNode) => void;
  onRenderItem?: (node: TreeNode, level: number) => ReactNode;
}
function calculateLevelPadding(level: number) {
  return 2*level;
}
export const TreeViewItem = (props: ITreeViewItemProps) => {
  const [isDraggingOverBranch, setIsDraggingOverBranch] = useState(false);
  const placeholderTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const thisPlaceholder = useMemo(() => (new TreeNode({
    id: `pl${props.node?.id || 0}`, parentId: props.node?.id || null, isPlaceholder: true})),
    [props.node])

  useEffect(() => {
    return () => {
      clearPlaceholderTimeout();
    };
  }, []);

  const clearPlaceholderTimeout = () => {
    if (placeholderTimeoutRef.current) {
      clearTimeout(placeholderTimeoutRef.current);
      placeholderTimeoutRef.current = null;
    }
  }
  const isDraggedNode = (node?: TreeNode) => {
    return props.draggedNodeId === node?.id;
  }
  const isTargetNode = (node?: TreeNode) => {
    return node && props.targetNodeId === node.id && !isDraggedNode(node);
  }

  const handleDragStart = (node?: TreeNode) => () => {
    props.setDraggedNodeId(node?.id || null)
    console.log("dragStart", node?.id)
  }
  const handleDragOver = (node?: TreeNode) => (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    //console.log("dragOver", node)
    // if(!draggingItem?.canHaveParent && node.parentId) {
    //   console.log("none")
    //   e.dataTransfer.dropEffect = 'none';
    // }
    // else {
      props.setTargetNodeId(node?.id || null)
    //}
    if (!isDraggingOverBranch && props.node?.canHaveChildren) {
      setIsDraggingOverBranch(true);
    }
  }
  const delayedResetIsDraggingOverBranch = () => {
    console.log("delayedResetIsDraggingOverBranch", placeholderTimeoutRef.current)
    clearPlaceholderTimeout();
    placeholderTimeoutRef.current = setTimeout(() => {
      setIsDraggingOverBranch(false);
    }, 2000);
  }
  const handleDragLeave = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    console.log("handleDragLeave", props.targetNodeId)
    props.setTargetNodeId(null)
    if(isDraggingOverBranch)
      delayedResetIsDraggingOverBranch();
  }
  const handleDragEnd = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    props.setDraggedNodeId(null);
    props.setTargetNodeId(null);
    setIsDraggingOverBranch(false);
    console.log("dragEnd")
  }
  const handleDrop = (node?: TreeNode) => (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    props.onCompleteMove(node);
    props.setDraggedNodeId(null);
    props.setTargetNodeId(null);
    setIsDraggingOverBranch(false);
    console.log("drop")
  }

  return (
    <Fragment>
      {props.node && <li
        className={clsx('draggable-tree-item', isDraggedNode(props.node) && "draggable-tree-item__dragging",
          isTargetNode(props.node) && "draggable-tree-item__target", props.className)}
        style={{marginLeft: `${calculateLevelPadding(props.level)}em`}}
        draggable
        onDragStart={handleDragStart(props.node)}
        onDragOver={handleDragOver(props.node)}
        onDragEnd={handleDragEnd}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop(props.node)}
      >
        {props.onRenderItem 
          ? props.onRenderItem(props.node, props.level)
          : <div>{props.node.title}</div>}
      </li>}
      {
        props.childNodes?.map(cnode => (
          <TreeViewItem
            className={props.className}
            key={cnode.id}
            node={cnode}
            childNodes={findChildren(props.treeData || [], cnode.id)}
            level={props.level + 1}
            treeData={props.treeData}
            onCompleteMove={props.onCompleteMove}
            draggedNodeId={props.draggedNodeId}
            targetNodeId={props.targetNodeId}
            setDraggedNodeId={props.setDraggedNodeId}
            setTargetNodeId={props.setTargetNodeId}
            onRenderItem={props.onRenderItem}
          />
        ))
      }
      {(props.node === null || props.node.canHaveChildren
        && isDraggingOverBranch)
        && <li
          className={clsx('draggable-tree-item draggable-tree-item__placeholder',
            isTargetNode(thisPlaceholder) && "draggable-tree-item__target",
            props.className)}
          style={{marginLeft: `${calculateLevelPadding(props.level+1)}em`}}
          draggable={false}
          onDragOver={handleDragOver(thisPlaceholder)}
          onDragLeave={handleDragLeave}
          onDragEnd={handleDragEnd}
          onDrop={handleDrop(thisPlaceholder)}
        ></li>
      }
    </Fragment>
  );
};
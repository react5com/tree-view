import { DragEvent, Fragment, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { findChildren, IdType, TreeNode } from "../logic";
import clsx from "clsx";
import "./TreeViewItem.css"
import { CheckBox } from "../CheckBox";

interface ITreeViewItemProps<T = unknown> {
  className?: string;
  node: TreeNode<T> | null;
  treeData?: TreeNode<T>[];
  childNodes?: TreeNode<T>[];
  draggedNodeId: IdType | null;
  targetNodeId: IdType | null;
  setDraggedNodeId: (nodeId: IdType | null) => void;
  setTargetNodeId: (nodeId: IdType | null) => void;
  level: number;
  readonly?: boolean;
  onCompleteMove: (node?: TreeNode<T>) => void;
  onRenderItem?: (node: TreeNode<T>, level: number) => ReactNode;
  onCalculateLevelPadding?: (level: number) => string;
  selectedItems?: IdType[];
  onSelected?: (id: IdType) => void;
}

export const TreeViewItem = <T=unknown,>({node, onCalculateLevelPadding,
  draggedNodeId, targetNodeId, setDraggedNodeId, setTargetNodeId,
  onCompleteMove, onSelected, selectedItems, className, level,
  onRenderItem, treeData, childNodes, readonly}: ITreeViewItemProps<T>) => {
  const [isDraggingOverBranch, setIsDraggingOverBranch] = useState(false);
  const placeholderTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const thisPlaceholder = useMemo(() => (new TreeNode<T>({
    id: `pl${node?.id || 0}`, parentId: node?.id || null})),
    [node])

  useEffect(() => {
    return () => {
      clearPlaceholderTimeout();
    };
  }, []);

  function calculateLevelPadding(level: number) {
    if(onCalculateLevelPadding) 
      return onCalculateLevelPadding(level);
    return `${level}em`;
  }
  const clearPlaceholderTimeout = () => {
    if (placeholderTimeoutRef.current) {
      clearTimeout(placeholderTimeoutRef.current);
      placeholderTimeoutRef.current = null;
    }
  }
  const isDraggedNode = (node?: TreeNode<T>) => {
    return draggedNodeId === node?.id;
  }
  const isTargetNode = (node?: TreeNode<T>) => {
    return node && targetNodeId === node.id && !isDraggedNode(node);
  }

  const handleDragStart = (node?: TreeNode<T>) => () => {
    setDraggedNodeId(node?.id || null)
    //console.log("dragStart", node?.id)
  }
  const handleDragOver = (node?: TreeNode<T>) => (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    //console.log("dragOver", node)
    // if(!draggingItem?.canHaveParent && node.parentId) {
    //   console.log("none")
    //   e.dataTransfer.dropEffect = 'none';
    // }
    // else {
      setTargetNodeId(node?.id || null)
    //}
    if (!isDraggingOverBranch && node?.canHaveChildren) {
      setIsDraggingOverBranch(true);
    }
  }
  const delayedResetIsDraggingOverBranch = () => {
    //console.log("delayedResetIsDraggingOverBranch", placeholderTimeoutRef.current)
    clearPlaceholderTimeout();
    placeholderTimeoutRef.current = setTimeout(() => {
      setIsDraggingOverBranch(false);
    }, 2000);
  }
  const handleDragLeave = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    //console.log("handleDragLeave", props.targetNodeId)
    setTargetNodeId(null)
    if(isDraggingOverBranch)
      delayedResetIsDraggingOverBranch();
  }
  const handleDragEnd = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    setDraggedNodeId(null);
    setTargetNodeId(null);
    setIsDraggingOverBranch(false);
    //console.log("dragEnd")
  }
  const handleDrop = (node?: TreeNode<T>) => (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    onCompleteMove(node);
    setDraggedNodeId(null);
    setTargetNodeId(null);
    setIsDraggingOverBranch(false);
    //console.log("drop")
  }

  const handleSelectedChange = (id: IdType) => () => {
    if(onSelected) onSelected(id)
  }
  const isSelected = (id: IdType) => selectedItems?.includes(id) || false;
  return (
    <Fragment>
      {node && <li
        className={clsx('draggable-tree-item', isDraggedNode(node) && "draggable-tree-item__dragging",
          isTargetNode(node) && "draggable-tree-item__target", className)}
        style={{marginLeft: calculateLevelPadding(level)}}
        draggable={!readonly}
        onDragStart={handleDragStart(node)}
        onDragOver={handleDragOver(node)}
        onDragEnd={handleDragEnd}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop(node)}
      >
        {(onSelected && !readonly)
          && <CheckBox
                id={`check${node.id}`}
                onChange={handleSelectedChange(node.id)}
                checked={isSelected(node.id)}
              />}
        {onRenderItem 
          ? onRenderItem(node, level)
          : <div>{node.title}</div>}
      </li>}
      {
        childNodes?.map(cnode => (
          <TreeViewItem
            className={className}
            key={cnode.id}
            node={cnode}
            childNodes={findChildren(treeData || [], cnode.id)}
            level={level + 1}
            readonly={readonly}
            treeData={treeData}
            onCompleteMove={onCompleteMove}
            draggedNodeId={draggedNodeId}
            targetNodeId={targetNodeId}
            setDraggedNodeId={setDraggedNodeId}
            setTargetNodeId={setTargetNodeId}
            selectedItems={selectedItems}
            onSelected={onSelected}
            onRenderItem={onRenderItem}
          />
        ))
      }
      {(node === null || node.canHaveChildren
        && isDraggingOverBranch)
        && <li
          className={clsx('draggable-tree-item draggable-tree-item__placeholder',
            isTargetNode(thisPlaceholder) && "draggable-tree-item__target",
            className)}
          style={{marginLeft: calculateLevelPadding(level+1)}}
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
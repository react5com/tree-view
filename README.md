# Simple tree view component in React + TypeScript

A simple and customizable Tree View React component. It supports items reordering and moving between tree branches with drag-n-drop. 

## Installation

```bash
# Using Yarn
npm i draggable-tree-view --save
```
or
```
# Using Npm
yarn add draggable-tree-view
```

## Sample
```
import { TreeView, TreeNode } from "draggable-tree-view"
import 'draggable-tree-view/dist/style.css';

const treeDataSample: TreeNode[] = [
  new TreeNode({ id: 1, title: 'Root Item 1', position: 1, canHaveParent: false }),
  new TreeNode({ id: 2, title: 'Root Item 2', position: 2, canHaveParent: false }),
  new TreeNode({ id: 3, title: 'Child Item 1 of Root 1 id 3', position: 1, parentId: 1, canHaveChildren: false }),
  new TreeNode({ id: 4, title: 'Child Item 2 of Root 1 id 4', position: 2, parentId: 1, canHaveChildren: false }),
  new TreeNode({ id: 5, title: 'Child Item 1 of Root 2 id 5', position: 1, parentId: 2, canHaveChildren: false }),
  new TreeNode({ id: 6, title: 'Branch Item 3 id 6', position: 2, parentId: 1 }),
  new TreeNode({ id: 7, title: 'Child Item 1 of Branch 3 id 7', position: 1, parentId: 6, canHaveChildren: false }),
];

function App() {
  return (
    <>
      <h1>Draggable tree</h1>
      <TreeView items={treeDataSample} onRenderItem={(node) => <div>{node.title}</div>}/>
    </>
  )
}
```

## License

This project is licensed under the MIT License. For more information, see the [LICENSE](LICENSE) file.

## Support

For support and bug reports, please [open an issue](https://github.com/alfed7/draggable-tree-view/issues) on GitHub.
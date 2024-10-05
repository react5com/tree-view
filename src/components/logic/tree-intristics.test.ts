import {describe, expect, test} from '@jest/globals';
import { findItemById, repositionItems } from './tree-intristics';
import { TreeNode } from './interfaces';

const treeDataSample: TreeNode[] = [
  new TreeNode({ id: 1, title: 'Root Item 1', position: 1, canHaveParent: false }),
  new TreeNode({ id: 2, title: 'Root Item 2', position: 2, canHaveParent: false }),
  new TreeNode({ id: 3, title: 'Child Item 1 of Root 1', position: 1, parentId: 1, canHaveChildren: false }),
  new TreeNode({ id: 4, title: 'Child Item 2 of Root 1', position: 2, parentId: 1, canHaveChildren: false }),
  new TreeNode({ id: 5, title: 'Child Item 1 of Root 2', position: 1, parentId: 2, canHaveChildren: false }),
  new TreeNode({ id: 6, title: 'Branch Item 3', position: 2, parentId: 1 }),
  new TreeNode({ id: 7, title: 'Child Item 1 of Branch 3', position: 1, parentId: 6, canHaveChildren: false }),
];
function deepCloneList<T>(originalList: T[]) {
  return originalList.map(n => ({...n}))
  //return JSON.parse(JSON.stringify(originalList)) as T[];
}
describe('reposition tree items', () => {
  test('reposition top level', () => {
    const treeData = deepCloneList(treeDataSample);
    const updatedData = repositionItems(treeData, treeData[1],treeData[0])
    expect(findItemById(updatedData, 1)?.position).toBe(2)
    expect(findItemById(updatedData, 2)?.position).toBe(1)
  });
  test('can\'t drop before itself', () => {
    const treeData = deepCloneList(treeDataSample);
    const updatedData = repositionItems(treeData, treeData[3],treeData[3])
    expect(findItemById(updatedData, 4)?.position).toBe(2)
    expect(findItemById(updatedData, 4)?.parentId).toBe(1)
  });
  test('can\'t drop as a child of itself', () => {
    const treeData = deepCloneList(treeDataSample);
    const updatedData = repositionItems(treeData, treeData[5],treeData[6])
    expect(findItemById(updatedData, 6)?.parentId).toBe(1)
    expect(findItemById(updatedData, 6)?.position).toBe(2)
    expect(findItemById(updatedData, 7)?.parentId).toBe(6)
    expect(findItemById(updatedData, 7)?.position).toBe(1)
  });
  test('reposition children within the same parent node', () => {
    const treeData = deepCloneList(treeDataSample);
    const updatedData = repositionItems(treeData, treeData[3], treeData[2])
    expect(findItemById(updatedData, 3)?.position).toBe(2)
    expect(findItemById(updatedData, 4)?.position).toBe(1)
  });
  test('move children between parent nodes', () => {
    const treeData = deepCloneList(treeDataSample);
    expect(treeData[3].id).toBe(4)
    expect(treeData[3].position).toBe(2)
    expect(treeData[3].parentId).toBe(1)
    const updatedData = repositionItems(treeData, treeData[4], treeData[3])
    expect(findItemById(updatedData, 5)?.position).toBe(2)
    expect(findItemById(updatedData, 4)?.position).toBe(3)
    expect(findItemById(updatedData, 5)?.parentId).toBe(1)
    expect(findItemById(updatedData, 4)?.parentId).toBe(1)
  });
  test('move child item to the end of the top level', () => {
    const treeData = deepCloneList(treeDataSample);
    const updatedData = repositionItems(treeData, treeData[4], null)
    expect(findItemById(updatedData, 5)?.position).toBe(3)
    expect(findItemById(updatedData, 5)?.parentId).toBe(null)
  });
  test('move child item to the end of another parent', () => {
    const treeData = deepCloneList(treeDataSample);
    const updatedData = repositionItems(treeData, treeData[4], {id: '0', parentId: 1})
    expect(findItemById(updatedData, 5)?.position).toBe(3)
    expect(findItemById(updatedData, 5)?.parentId).toBe(1)
  });
  test('restrict moving as child when canHaveChildren is false', () => {
    const treeData = deepCloneList(treeDataSample);
    const updatedData = repositionItems(treeData, treeData[0], treeData[4])
    expect(findItemById(updatedData, 1)?.position).toBe(1)
    expect(findItemById(updatedData, 1)?.parentId).toBeUndefined()
    expect(findItemById(updatedData, 5)?.position).toBe(1)
    expect(findItemById(updatedData, 5)?.parentId).toBe(2)
  });
});
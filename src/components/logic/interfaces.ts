export type IdType = string | number;

export interface ITreeNode<T = unknown> {
  id: IdType;
  title?: string;
  position?: number;
  parentId?: IdType | null;
  canHaveParent?: boolean;
  canHaveChildren?: boolean;
  data?: T;
}
export class TreeNode<T = unknown> implements ITreeNode<T> {
  public id: IdType = 0;
  public title?: string;
  public position?: number;
  public parentId?: IdType | null = null;
  public canHaveParent?: boolean = true;
  public canHaveChildren?: boolean = true;
  public data?: T;

  constructor(copy: ITreeNode<T>) {
    this.id = copy.id;
    this.title = copy.title;
    this.position = copy.position;
    this.parentId = copy.parentId;
    if(typeof(copy.canHaveParent) !== "undefined")
      this.canHaveParent = copy.canHaveParent;
    if(typeof(copy.canHaveChildren) !== "undefined")
      this.canHaveChildren = copy.canHaveChildren;
    this.data = copy.data;
  }
}
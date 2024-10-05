export type IdType = string | number;

export interface ITreeNode {
  id: IdType;
  title?: string;
  position?: number;
  parentId?: IdType | null;
  canHaveParent?: boolean;
  canHaveChildren?: boolean;
  isPlaceholder?: boolean;
}
export class TreeNode implements ITreeNode {
  public id: IdType = 0;
  public title?: string;
  public position?: number;
  public parentId?: IdType | null = null;
  public canHaveParent?: boolean = true;
  public canHaveChildren?: boolean = true;
  public isPlaceholder?: boolean = false;

  constructor(copy: ITreeNode) {
    this.id = copy.id;
    this.title = copy.title;
    this.position = copy.position;
    this.parentId = copy.parentId;
    if(typeof(copy.canHaveParent) !== "undefined")
      this.canHaveParent = copy.canHaveParent;
    if(typeof(copy.canHaveChildren) !== "undefined")
      this.canHaveChildren = copy.canHaveChildren;
    if(typeof(copy.isPlaceholder) !== "undefined")
      this.isPlaceholder = copy.isPlaceholder;
  }
}
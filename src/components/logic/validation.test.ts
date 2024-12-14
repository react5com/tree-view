import { validateItems } from './tree-intristics';

describe('hasDuplicateIds', () => {
  it('should return null when there are no duplicate ids', () => {
    const items = [
      { id: '1', title: 'Item 1' },
      { id: '2', title: 'Item 2' },
      { id: '3', title: 'Item 3' },
    ];

    const result = validateItems(items);
    expect(result).toBeNull();
  });

  it('should return an error message when there are duplicate ids', () => {
    const items = [
      { id: '1', title: 'Item 1' },
      { id: '2', title: 'Item 2' },
      { id: '1', title: 'Item 3' },
    ];

    const result = validateItems(items);
    expect(result).toBe('Duplicate id found: 1');
  });

  it('should return null for an empty array', () => {
    const items: { id: string; title: string }[] = [];

    const result = validateItems(items);
    expect(result).toBeNull();
  });

  it('should handle items with similar but not identical ids', () => {
    const items = [
      { id: '1', title: 'Item 1' },
      { id: '01', title: 'Item 2' },
    ];

    const result = validateItems(items);
    expect(result).toBeNull();
  });
});

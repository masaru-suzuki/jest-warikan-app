import fs from 'fs';
import { GroupRepository } from './groupRepository';
import { Group } from '../type';

// 実際にファイル操作は行わないため、jest.mock()でモック化
jest.mock('fs');

describe('GroupRepository', () => {
  const mockFs = jest.mocked(fs);
  let repo: GroupRepository;

  // テスト実行前にクリアされるようにする=>なんで？
  beforeEach(() => {
    mockFs.existsSync.mockClear();
    mockFs.readFileSync.mockClear();
    mockFs.writeFileSync.mockClear();
    repo = new GroupRepository('groups.json');
  });

  // 正常系テストから
  describe('loadGroups', () => {
    it('グループ一覧が取得できる', () => {
      // expect(repo.loadGroups()).toEqual([]);
      const groups: Group[] = [
        { name: 'group1', members: ['dog', 'cat'] },
        { name: 'group2', members: ['apple', 'orange'] },
      ];
      const mockData = JSON.stringify(groups);
      mockFs.existsSync.mockReturnValueOnce(true); // なんで行っている？
      mockFs.readFileSync.mockReturnValueOnce(mockData); // なんで行っている？
      const result = repo.loadGroups();
      // expect(result).toEqual(mockData);//→mockDataではなくgroupsを期待している
      expect(result).toEqual(groups);
    });
    it('ファイルが存在しない場合は[]が返される', () => {
      mockFs.existsSync.mockReturnValueOnce(false);
      // mockFs.readFileSync.mockReturnValueOnce(JSON.stringify([]));//不要だった
      const result = repo.loadGroups();
      expect(result).toEqual([]);
    });
  });

  // describe('saveGroup', () => {
  //   it('グループが保存される', () => {
  //     // グループのモックを作成
  //     const group: Group[] = [
  //       { name: 'group1', members: ['dog', 'cat'] },
  //       { name: 'group2', members: ['apple', 'orange'] },
  //     ];
  //     const newGroup: Group = { name: 'group3', members: ['banana', 'peach'] };
  //     const resultGroup = [...group, newGroup];

  //     // writeFileSyncで保存されたグループを確認
  //     mockFs.existsSync.mockReturnValueOnce(true);
  //     mockFs.readFileSync.mockReturnValueOnce(JSON.stringify([]));
  //     repo.saveGroup(newGroup);
  //     expect(mockFs.writeFileSync).toHaveBeenCalledWith(
  //       'groups.json',
  //       JSON.stringify([newGroup])
  //     );

  //     // readFileSyncで保存されたグループを取得 => 不要
  //     // mockFs.existsSync.mockReturnValueOnce(true);
  //     // mockFs.readFileSync.mockReturnValueOnce(JSON.stringify(resultGroup));
  //     // const result = repo.loadGroups();
  //     // expect(result).toEqual(resultGroup);
  //   });
  // });
});

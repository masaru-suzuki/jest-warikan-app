import express from 'express';
import { GroupService } from '../services/groupService';
import { GroupController } from './groupController';
import { Group } from '../type';

// ARRANGE: テストの準備
// ACT: テストの実行
// ASSERT: テストの検証

describe('GroupController', () => {
  // ARRANGE: テストの準備
  let mockGroupService: Partial<GroupService>;
  let req: Partial<express.Request>;
  let res: Partial<express.Response>;
  let next: jest.Mock; // どうしてjest.Mock?
  let groupController: GroupController;

  beforeEach(() => {
    mockGroupService = {
      getGroups: jest.fn(),
      getGroupByName: jest.fn(),
      addGroup: jest.fn(),
    };

    groupController = new GroupController(mockGroupService as GroupService);

    req = {};

    // resのモックかが必要な理由がわからない
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };

    next = jest.fn();
  });

  // ACT: テストの実行
  describe('attGroup', () => {
    it('グループが登録される', () => {
      const group: Group = { name: 'group1', members: ['一郎', '二郎'] };
      req.body = group;
      (mockGroupService.getGroups as jest.Mock).mockReturnValueOnce([]); //グループの登録がなかったことを想定
      groupController.addGroup(
        req as express.Request,
        res as express.Response,
        next as express.NextFunction
      );
      // ASSERT: テストの検証
      expect(mockGroupService.addGroup).toHaveBeenLastCalledWith(group);
      expect(res.status).toHaveBeenLastCalledWith(200);
    });

    // スキーマ関連のテスト
    it('バリデーションエラー: グループ名は必須', () => {
      const invalidGroup: Group = { name: '', members: ['一郎', '二郎'] };
      req.body = invalidGroup;
      groupController.addGroup(
        req as express.Request,
        res as express.Response,
        next as express.NextFunction
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(['グループ名は必須です']); // 注意:errorは配列で返す
    });

    it('バリデーションエラー: メンバーは2人以上必要', () => {
      const invalidGroup: Group = { name: 'group1', members: ['一郎'] };
      req.body = invalidGroup;
      groupController.addGroup(
        req as express.Request,
        res as express.Response,
        next as express.NextFunction
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(['メンバーは2人以上必要です']); // 注意:errorは配列で返す
    });

    it('バリデーションエラー: 同じ名前のメンバーは登録できない', () => {
      const invalidGroup: Group = { name: 'group1', members: ['一郎', '一郎'] };
      req.body = invalidGroup;
      groupController.addGroup(
        req as express.Request,
        res as express.Response,
        next as express.NextFunction
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(['メンバー名が重複しています']); // 注意:errorは配列で返す
    });
  });
});

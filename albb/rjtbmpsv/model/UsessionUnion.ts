import { Miniapp } from "./Miniapp";
import { Shop } from "./Shop";
import { User } from "./User";
import { Visitor } from "./Visitor";

/**
 * 用户会话包含者几个表的信息
 */
export class UsessionUnion {

  shop?: Shop;

  user?: User;

  miniapp?: Miniapp;

  visitor?: Visitor;

}

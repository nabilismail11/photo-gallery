import { Post } from "../types/post";

type ActionMap<M extends { [index: string]: any }> = {
    [Key in keyof M]: M[Key] extends undefined
      ? {
          type: Key;
        }
      : {
          type: Key;
          payload: M[Key];
        }
  };
  
  export enum Types {
    Create = 'CREATE_POST',
    Delete = 'DELETE_POST',
  }

  type PostPayload = {
    [Types.Create] : Post[]
    [Types.Delete]: Post;
  }

export type PostActions = ActionMap<PostPayload>[keyof ActionMap<PostPayload>];

export const postReducer = (state: Post[], action: PostActions) => {
  switch (action.type) {
    case Types.Create:
      return {
          posts:action.payload
      }
       
      
    case Types.Delete:
      return {
        
        ...state.filter(post => post.id !== action.payload.id),
      }
      
    default:
      return state;
  }
}

import { Post } from "../types/post";

import { createContext, ReactNode, useReducer } from "react";

interface PostsContextType {
  posts: Post[];
  getPosts: (items: Post[]) => void;
  addPost: (item: Post) => void;
  delPost: (item: Post) => void;
  // getPost: (id: number) => void;
}
export enum Types {
  Create = "ADD",
  Delete = "DELETE",
  Get = "GET",
  // GetPost = "GETPOST",
}

type PostPayload = {
  [Types.Create]: Post;
  [Types.Delete]: Post;
  [Types.Get]: Post[];
  // [Types.GetPost]: number;
};
export type PostActions = ActionMap<PostPayload>[keyof ActionMap<PostPayload>];

export const PostsContext = createContext<PostsContextType>({
  posts: [],
  getPosts: () => {},
  addPost: () => {},
  delPost: () => {},
  // getPost: () => {},
});

interface State {
  posts: Post[];
}

type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export const postReducer = (state: State, action: PostActions): State => {
  switch (action.type) {
    case Types.Get:
      return {
        posts: action.payload,
      };
    case Types.Create:
      return { posts: [action.payload, ...state.posts] };
    case Types.Delete:
      return {
        posts: state.posts.filter((post) => post.id !== action.payload.id),
      };
    // case Types.GetPost:
    //   return {
    //     posts: state.posts.filter((post) => post.id === action.payload),
    //   };
    default:
      return state;
  }
};

export const PostContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(postReducer, { posts: [] });
  const getPosts = (posts: Post[]) => {
    dispatch({ type: Types.Get, payload: posts });
  };
  const addPost = (post: Post) => {
    dispatch({ type: Types.Create, payload: post });
  };
  const delPost = (post: Post) => {
    dispatch({ type: Types.Delete, payload: post });
  };

  // const getPost = (id: number) => {
  //   dispatch({ type: Types.GetPost, payload: id });
  // };
  return (
    <PostsContext.Provider value={{ ...state, getPosts, addPost, delPost }}>
      {children}
    </PostsContext.Provider>
  );
};

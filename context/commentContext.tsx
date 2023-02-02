import { Comment } from "../types/comment";

import { createContext, ReactNode, useReducer } from "react";

interface CommentContextType {
  comments: Comment[];
  getComments: (items: Comment[]) => void;
  addComment: (item: Comment) => void;
  delComment: (item: Comment) => void;
  // getPost: (id: number) => void;
}
export enum Types {
  Create = "ADD",
  Delete = "DELETE",
  Get = "GET",
  // GetPost = "GETPOST",
}

type CommentPayload = {
  [Types.Create]: Comment;
  [Types.Delete]: Comment;
  [Types.Get]: Comment[];
  // [Types.GetPost]: number;
};
export type CommentActions =
  ActionMap<CommentPayload>[keyof ActionMap<CommentPayload>];

export const CommentsContext = createContext<CommentContextType>({
  comments: [],
  getComments: () => {},
  addComment: () => {},
  delComment: () => {},
  // getPost: () => {},
});

interface State {
  comments: Comment[];
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

export const commentReducer = (state: State, action: CommentActions): State => {
  switch (action.type) {
    case Types.Get:
      return {
        comments: action.payload,
      };
    case Types.Create:
      return { comments: [action.payload, ...state.comments] };
    case Types.Delete:
      return {
        comments: state.comments.filter(
          (post) => post.id !== action.payload.id
        ),
      };
    // case Types.GetPost:
    //   return {
    //     posts: state.posts.filter((post) => post.id === action.payload),
    //   };
    default:
      return state;
  }
};

export const CommentContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [state, dispatch] = useReducer(commentReducer, { comments: [] });
  const getComments = (posts: Comment[]) => {
    //console.log(posts);

    dispatch({ type: Types.Get, payload: posts });
  };
  const addComment = (post: Comment) => {
    dispatch({ type: Types.Create, payload: post });
  };
  const delComment = (post: Comment) => {
    dispatch({ type: Types.Delete, payload: post });
  };

  // const getPost = (id: number) => {
  //   dispatch({ type: Types.GetPost, payload: id });
  // };
  return (
    <CommentsContext.Provider
      value={{ ...state, getComments, addComment, delComment }}
    >
      {children}
    </CommentsContext.Provider>
  );
};

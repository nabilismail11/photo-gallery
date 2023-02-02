import { CommentsContext } from "../context/commentContext";

import { useContext } from "react";

export const useCommentContext = () =>{
    const context = useContext(CommentsContext)
    
    if (!context) {
        throw new Error("context error");
        
    }
    
    return context
}
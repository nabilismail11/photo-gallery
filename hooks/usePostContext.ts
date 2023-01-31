import { PostsContext } from "../context/postContext";

import { useContext } from "react";

export const usePostContext = () =>{
    const context = useContext(PostsContext)
    
    if (!context) {
        throw new Error("context error");
        
    }
    
    return context
}
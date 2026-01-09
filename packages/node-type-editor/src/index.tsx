import {NodeM, NodeVM} from "@forest/schema"
import React from "react";
import TiptapEditor, {makeSimpleEditor} from "./editor";
import {Map as YMap, XmlFragment} from "yjs";
import {NodeTypeM} from "@forest/schema/src/nodeTypeM";
import {NodeTypeVM} from "@forest/schema/src/nodeTypeVM";
import {Box} from "@mui/material";

const EditorXmlFragment = "ydatapaperEditor"

export class EditorNodeTypeM extends NodeTypeM {
    static displayName = "Editor"
    static allowReshape = true
    static allowAddingChildren = true
    static allowEditTitle = true
    static allowedChildrenTypes = ["EditorNodeType"]

    static getYxml(node: NodeM): XmlFragment {
        if (!node.ydata().has(EditorXmlFragment)) {
            EditorNodeTypeM.ydataInitialize(node);
        }
        let yXML: XmlFragment = node.ydata().get(EditorXmlFragment) as unknown as XmlFragment;
        return yXML;
    }

    static getEditorContent(node: NodeM): string {
        const editor = makeSimpleEditor(EditorNodeTypeM.getYxml(node));
        const htmlContent = editor.getHTML();
        editor.destroy()
        return htmlContent;
    }

    static setEditorContent(node: NodeM, htmlContent: string) {
        const editor = makeSimpleEditor(EditorNodeTypeM.getYxml(node));
        try {
            editor.commands.setContent(htmlContent);
        } catch (e) {
            console.warn("Error setting content", htmlContent);
            throw e;
        } finally {
            editor.destroy()
        }
    }

    static validateEditorContent(htmlContent: string) {
        const editor = makeSimpleEditor(null);
        try {
            editor.commands.setContent(htmlContent);
        } catch (e) {
            editor.destroy()
            return false
        }
        editor.destroy()
        return true
    }

    static renderPrompt(node: NodeM): string {
        return ""
    }

    static ydataInitialize(node: NodeM) {
        const ydata = new YMap()
        const yXML = new XmlFragment();
        ydata.set(EditorXmlFragment, yXML);
        node.ymap.set("ydata", ydata);
        //console.log("Initialized ydata for EditorNodeTypeM", node.id, node.ymap.get("ydata"))
    }
}

export class EditorNodeTypeVM extends NodeTypeVM {

    static oneTool = true

    static render(node: NodeVM): React.ReactNode {
        const yXML = EditorNodeTypeM.getYxml(node.nodeM)
        return <>
            <TiptapEditor yXML={yXML} nodeM={node.nodeM}/>
        </>
    }

    static renderTool(node: NodeVM): React.ReactNode {
        return <EditorTools node={node}/>
    }
}

function EditorTools({node}: { node: NodeVM }) {
    return <Box>
        {/* AI tools have been removed */}
    </Box>
}
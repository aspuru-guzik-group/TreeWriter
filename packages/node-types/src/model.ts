import {EditorNodeTypeM} from "@forest/node-type-editor"
import {ReaderNodeTypeM} from "@forest/node-type-reader"
import {EmbeddedNodeTypeM} from "@forest/node-type-embedded"
import {CustomNodeTypeM} from "@forest/node-components"
import {NodeTypeM} from "@forest/schema/src/nodeTypeM";

const typeInstances = {
    "CustomNodeType": CustomNodeTypeM,
    "EditorNodeType": EditorNodeTypeM,
    "ReaderNodeType": ReaderNodeTypeM,
    "EmbeddedNodeType": EmbeddedNodeTypeM,
};

export const supportedNodeTypesM = (typeName: string): typeof NodeTypeM | null => {
    if (typeName in typeInstances) {
        return typeInstances[typeName];
    }
    return null;
}

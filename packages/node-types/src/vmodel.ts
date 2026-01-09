import {EditorNodeTypeVM} from "@forest/node-type-editor"
import {ReaderNodeTypeVM} from "@forest/node-type-reader"
import {EmbeddedNodeTypeVM} from "@forest/node-type-embedded"
import {SupportedNodeTypesVM} from "@forest/schema/src/viewModel";

// @ts-ignore
const typeModules = {
    "CustomNodeType": () => import("@forest/node-components").then(m => m.CustomNodeTypeVM),
    "EditorNodeType": async () => EditorNodeTypeVM,
    "ReaderNodeType": async () => ReaderNodeTypeVM,
    "EmbeddedNodeType": async () => EmbeddedNodeTypeVM,
};

// Cache for loaded types AND loading promises
const loadedTypes: Record<string, Promise<any>> = {};

export const supportedNodeTypesVM: SupportedNodeTypesVM = async (typeName: string) => {
    // Return from cache if already loading or loaded
    if (loadedTypes[typeName]) {
        return loadedTypes[typeName];
    }

    // Load the type dynamically
    if (typeName in typeModules) {
        try {
            // Store the promise in cache before awaiting
            loadedTypes[typeName] = typeModules[typeName]().then(nodeType => {
                console.log(`Loaded node type VM: ${typeName}`);
                return nodeType;
            });
            return await loadedTypes[typeName];
        } catch (error) {
            console.error(`Failed to load node type VM: ${typeName}`, error);
            delete loadedTypes[typeName]; // Remove failed promise from cache
            return null;
        }
    }

    return null;
}

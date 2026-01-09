import {EditorNodeTypeM} from "../..";
import {stageThisVersion} from "@forest/schema/src/stageService";
import {NodeM, NodeVM} from "@forest/schema";
async function calculateSHA1(input) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);

    const hashBuffer = await crypto.subtle.digest('SHA-1', data);  // returns a promise
    const hashArray = Array.from(new Uint8Array(hashBuffer));        // convert buffer to byte array
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');  // convert bytes to hex
    return hashHex;
}

async function generateContentHash(content: string): Promise<string> {
    return (await calculateSHA1(content)).slice(0, 4);
}

function createDOMFromHTML(content: string): Document {
    const parser = new DOMParser();
    return parser.parseFromString(`<div>${content}</div>`, 'text/html');
}

export function getEditorContentExceptExports(currentNode: NodeM): string {
    const content = EditorNodeTypeM.getEditorContent(currentNode);
    const document = createDOMFromHTML(content);
    const wrapper = document.body.firstElementChild as HTMLElement;

    // Remove all export divs
    const exportDivs = wrapper.querySelectorAll('div.export');
    exportDivs.forEach(div => div.remove());

    return wrapper.innerHTML.trim();
}

export function removeExportContent(content: string): string {
    const document = createDOMFromHTML(content);
    const wrapper = document.body.firstElementChild as HTMLElement;

    // Remove all export divs
    const exportDivs = wrapper.querySelectorAll('div.export');
    exportDivs.forEach(div => div.remove());

    return wrapper.innerHTML.trim();
}

export function extractExportContent(content: string): string {
    const document = createDOMFromHTML(content);
    const wrapper = document.body.firstElementChild as HTMLElement;

    // Find the first export div
    const exportDiv = wrapper.querySelector('div.export');
    return exportDiv ? exportDiv.innerHTML.trim() : "";
}

export function extractExportContentAndHash(content: string): [string, string] {
    const document = createDOMFromHTML(content);
    const wrapper = document.body.firstElementChild as HTMLElement;

    // Find the first export div
    const exportDiv = wrapper.querySelector('div.export');
    const hash = exportDiv?.getAttribute('hash') || '';
    return [exportDiv ? exportDiv.innerHTML.trim() : "", hash]
}
export async function generateExportParagraphByNode(nodeM: NodeM, authToken: string, userPrompt?: string): Promise<string> {
    throw new Error("AI functionality has been removed. This feature is no longer available.");
}

export async function generateKeyPointsByNode(nodeM: NodeM, authToken: string): Promise<string> {
    throw new Error("AI functionality has been removed. This feature is no longer available.");
}

export async function updateExportContent(nodeM: NodeM, summary: string, sourceContent: string): Promise<void> {
    await stageThisVersion(nodeM, "Before export update");
    const currentContent = EditorNodeTypeM.getEditorContent(nodeM);
    const contentHash = await generateContentHash(sourceContent);

    const document = createDOMFromHTML(currentContent);
    const wrapper = document.body.firstElementChild as HTMLElement;

    // Find the first export div and update it
    const exportDiv = wrapper.querySelector('div.export');
    if (exportDiv) {
        exportDiv.setAttribute('hash', contentHash);
        exportDiv.innerHTML = summary;

        EditorNodeTypeM.setEditorContent(nodeM, wrapper.innerHTML);
    }
}

export async function replaceNonExportContent(nodeM: NodeM, newContent: string): Promise<void> {
    await stageThisVersion(nodeM, "Before points replacement");

    const currentContent = EditorNodeTypeM.getEditorContent(nodeM);
    const document = createDOMFromHTML(currentContent);
    const wrapper = document.body.firstElementChild as HTMLElement;

    // Find and preserve all export divs
    const exportDivs = Array.from(wrapper.querySelectorAll('div.export'));
    const exportElements = exportDivs.map(div => div.cloneNode(true));

    // Clear all content
    wrapper.innerHTML = '';

    // Add the new content
    wrapper.innerHTML = newContent;


    // Re-append all export divs at the end
    exportElements.forEach(exportElement => {
        wrapper.appendChild(exportElement);
    });

    EditorNodeTypeM.setEditorContent(nodeM, wrapper.innerHTML);
}

export interface UpdateExportOptions {
    onShowConfirmation?: (currentContent: string, summaryContent: string) => void;
    onError?: (error: any) => void;
    userPrompt?: string;
}

export async function handleUpdateExport(
    nodeM: NodeM,
    authToken: string,
    options: UpdateExportOptions = {}
): Promise<void> {
    try {
        // Get all content from the editor except export divs
        const allContent = getEditorContentExceptExports(nodeM);
        const currentContent = EditorNodeTypeM.getEditorContent(nodeM);

        // Extract current export div content
        const existingExportContent = extractExportContent(currentContent);

        const summary = await generateExportParagraphByNode(nodeM, authToken, options.userPrompt);

        // If there's existing content, show confirmation dialog
        if (existingExportContent && existingExportContent.length > 0) {
            if (options.onShowConfirmation) {
                options.onShowConfirmation(existingExportContent, summary);
            } else {
                // Fallback: update directly if no confirmation handler provided
                await updateExportContent(nodeM, summary, allContent);
            }
        } else {
            // No existing content, update directly
            await updateExportContent(nodeM, summary, allContent);
        }
    } catch (e) {
        if (options.onError) {
            options.onError(e);
        } else {
            throw e;
        }
    }
}

export async function handleUpdatePoints(
    nodeM: NodeM,
    authToken: string,
    options: UpdateExportOptions = {}
): Promise<void> {
    try {
        // Get all content from the editor except export divs
        const contentExceptExports = getEditorContentExceptExports(nodeM);

        const keyPoints = await generateKeyPointsByNode(nodeM, authToken);

        // Always show confirmation dialog for replacing content
        if (options.onShowConfirmation) {
            // Show the current non-export content vs the generated key points
            options.onShowConfirmation(contentExceptExports, keyPoints);
        } else {
            // Fallback: replace the non-export content directly
            await replaceNonExportContent(nodeM, keyPoints);
        }
    } catch (e) {
        if (options.onError) {
            options.onError(e);
        } else {
            throw e;
        }
    }
}
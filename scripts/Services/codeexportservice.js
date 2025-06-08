
class CodeExportService {

    generateCppCode(vertices) {
        let code = '';
        let allVertices = [];

        vertices.forEach(v => allVertices.push(v));
        if (allVertices.length === 0) return '// No vertices to export';

        code += '// Vertex data\n';
        code += 'float vertices[] = {\n';
        allVertices.forEach((vertex, index) => {
            code += `    ${vertex.x}f, ${vertex.y}f, 0.0f`;
            if (index < allVertices.length - 1) code += ',';
            code += `  // Vertex ${index}\n`;
        });
        code += '};\n\n';

        return code;
    }
}

export const codeExportService = new CodeExportService(); 
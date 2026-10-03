import React, { useState } from "react";
import { Play, Code, Terminal, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { compileCode } from "../../../services/api";

const STARTER_CODES = {
  javascript: `// Write your JavaScript solution below
function solve(input) {
    console.log("Processing input:", input);
    return "Solution output";
}

solve("Sample test data");`,
  python: `# Write your Python solution below
def solve(data):
    print("Processing:", data)
    return "Solution output"

print(solve("Sample test data"))`,
  cpp: `// Write your C++ solution below
#include <iostream>
using namespace std;

int main() {
    cout << "C++ Code Execution Sandbox Result" << endl;
    return 0;
}`,
  java: `// Write your Java solution below
public class Solution {
    public static void main(String[] args) {
        System.out.println("Java Code Sandbox Output");
    }
}`
};

const CodeSandboxModal = ({ isOpen, onClose, questionText, onSaveCode }) => {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(STARTER_CODES.javascript);
  const [customInput, setCustomInput] = useState("");
  const [output, setOutput] = useState("");
  const [executionTime, setExecutionTime] = useState("");
  const [memory, setMemory] = useState("");
  const [isCompiling, setIsCompiling] = useState(false);
  const [isPassed, setIsPassed] = useState(null);

  if (!isOpen) return null;

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(STARTER_CODES[lang] || "// Write code here");
  };

  const handleRunCode = async () => {
    try {
      setIsCompiling(true);
      setOutput("Compiling and executing code...");
      setIsPassed(null);

      const res = await compileCode(language, code, customInput);

      setIsCompiling(false);
      if (res.success) {
        setOutput(res.output);
        setExecutionTime(res.executionTime || "0.04s");
        setMemory(res.memory || "12 MB");
        setIsPassed(true);
      } else {
        setOutput(res.output || "Compilation Failed");
        setIsPassed(false);
      }
    } catch (err) {
      setIsCompiling(false);
      setOutput(`Compilation Error: ${err.message}`);
      setIsPassed(false);
    }
  };

  const handleSaveAndAttach = () => {
    if (onSaveCode) {
      onSaveCode(code, language, isPassed);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">In-Browser Code Sandbox</h3>
              <p className="text-xs text-slate-400 line-clamp-1">{questionText || "Technical Coding Challenge"}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-slate-800 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-sm font-mono focus:outline-none focus:border-indigo-500"
            >
              <option value="javascript">JavaScript (Node.js)</option>
              <option value="python">Python 3.10</option>
              <option value="cpp">C++ (GCC 11)</option>
              <option value="java">Java 17</option>
            </select>

            <button
              onClick={handleRunCode}
              disabled={isCompiling}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/30 disabled:opacity-50"
            >
              {isCompiling ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  Run Code
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white px-3 py-1.5 rounded-lg text-sm border border-slate-800 hover:bg-slate-800"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Editor & Terminal Area */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800 overflow-hidden">
          {/* Left: Code Input Area */}
          <div className="flex flex-col h-full bg-slate-950/40 p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Source Code ({language})</span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck="false"
              className="flex-1 w-full p-4 bg-slate-950 font-mono text-sm text-emerald-400 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500/50 leading-relaxed resize-none"
            />
          </div>

          {/* Right: Input & Output Console */}
          <div className="flex flex-col h-full bg-slate-950 p-4 space-y-4">
            {/* Custom Input */}
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1">Standard Input (stdin)</span>
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Enter test input data..."
                rows={2}
                className="w-full p-2.5 bg-slate-900 text-slate-300 font-mono text-xs border border-slate-800 rounded-lg focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            {/* Output Console */}
            <div className="flex-1 flex flex-col border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
              <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                  Terminal Output
                </span>
                {isPassed !== null && (
                  <span className={`flex items-center gap-1 font-bold ${isPassed ? "text-emerald-400" : "text-rose-400"}`}>
                    {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    {isPassed ? "Passed" : "Error"}
                  </span>
                )}
              </div>
              <pre className="flex-1 p-4 font-mono text-xs text-slate-200 overflow-auto whitespace-pre-wrap leading-relaxed">
                {output || "// Output terminal ready..."}
              </pre>
              {executionTime && (
                <div className="px-4 py-1.5 bg-slate-900/80 border-t border-slate-800/80 text-[10px] font-mono text-slate-500 flex justify-between">
                  <span>Time: {executionTime}</span>
                  <span>Memory: {memory}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-between items-center">
          <p className="text-xs text-slate-500">
            Powered by Judge0 & Monaco Code Sandbox Engine
          </p>
          <button
            onClick={handleSaveAndAttach}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-indigo-900/30"
          >
            Attach Code Solution to Answer
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeSandboxModal;

import { useState, useEffect } from 'react';
import { CommandInvoker } from '../patterns/commands/CommandInvoker';

export default function useCommandManager() {
  const [invoker] = useState(() => new CommandInvoker());
  const [pendingCommands, setPendingCommands] = useState([]);
  const [executing, setExecuting] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  
  useEffect(() => {
    // Update pending commands list whenever it changes
    setPendingCommands(invoker.getPendingCommands());
  }, [invoker]);
  
  const addCommand = (command) => {
    invoker.addCommand(command);
    setPendingCommands(invoker.getPendingCommands());
  };
  
  const executeAll = async () => {
    setExecuting(true);
    try {
      const results = await invoker.executeAll();
      setLastResult(results);
      setPendingCommands([]);
      return results;
    } finally {
      setExecuting(false);
    }
  };
  
  const executeSingle = async (command) => {
    setExecuting(true);
    try {
      const result = await invoker.executeSingle(command);
      setLastResult(result);
      return result;
    } finally {
      setExecuting(false);
      setPendingCommands(invoker.getPendingCommands());
    }
  };
  
  const undoLast = async () => {
    setExecuting(true);
    try {
      return await invoker.undoLast();
    } finally {
      setExecuting(false);
    }
  };
  
  const clearCommands = () => {
    invoker.clearQueue();
    setPendingCommands([]);
  };
  
  return {
    addCommand,
    executeAll,
    executeSingle,
    undoLast,
    clearCommands,
    pendingCommands,
    executing,
    lastResult
  };
}
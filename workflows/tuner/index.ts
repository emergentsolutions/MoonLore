import { parse } from 'yaml';
import { readFileSync } from 'fs';
import { createLogger } from '../../workers/api_generate/src/logger';

const logger = createLogger('tuner-workflow');

interface WorkflowContext {
  variables: Map<string, any>;
  iteration: number;
  maxIterations: number;
  targetScore: number;
}

export class TunerWorkflow {
  private workflow: any;
  private context: WorkflowContext;

  constructor(workflowPath: string) {
    const yamlContent = readFileSync(workflowPath, 'utf-8');
    this.workflow = parse(yamlContent);
    this.context = {
      variables: new Map(),
      iteration: 0,
      maxIterations: this.workflow.config.max_iterations,
      targetScore: this.workflow.config.target_score,
    };
  }

  async execute(userPrompt: string, style: string): Promise<any> {
    logger.info('Starting tuner workflow', { userPrompt, style });
    
    // Initialize variables
    this.context.variables.set('USER_PROMPT', userPrompt);
    this.context.variables.set('STYLE', style);
    this.context.variables.set('ITERATIONS', 0);
    this.context.variables.set('PASSED', false);

    try {
      // Execute workflow steps
      for (const step of this.workflow.steps) {
        const shouldExecute = await this.evaluateCondition(step.condition);
        
        if (shouldExecute) {
          logger.debug(`Executing step: ${step.name}`);
          await this.executeStep(step);
          
          // Check if we should continue iterating
          if (step.name === 'evaluate') {
            const passed = this.context.variables.get('PASSED');
            const iterations = this.context.variables.get('ITERATIONS');
            
            if (passed || iterations >= this.context.maxIterations) {
              break;
            }
          }
          
          // Loop back to generation after mutation
          if (step.name === 'mutate') {
            // Reset to generation step
            const generateStep = this.workflow.steps.find((s: any) => s.name === 'generate');
            if (generateStep) {
              await this.executeStep(generateStep);
            }
          }
        }
      }
      
      return this.context.variables.get('WORKFLOW_RESULT');
    } catch (error) {
      logger.error('Workflow execution failed', error);
      throw error;
    }
  }

  private async evaluateCondition(condition?: string): Promise<boolean> {
    if (!condition) return true;
    
    // Simple condition evaluation (can be enhanced)
    let evaluatedCondition = condition;
    for (const [key, value] of this.context.variables) {
      evaluatedCondition = evaluatedCondition.replace(`\${${key}}`, String(value));
    }
    
    // Use Function constructor for simple evaluation
    try {
      const result = new Function('return ' + evaluatedCondition)();
      return result;
    } catch (error) {
      logger.warn('Condition evaluation failed', { condition, error });
      return false;
    }
  }

  private async executeStep(step: any): Promise<void> {
    const action = this.workflow.actions[step.action];
    if (!action) {
      throw new Error(`Unknown action: ${step.action}`);
    }

    // Resolve input variables
    const inputs: any = {};
    for (const [key, value] of Object.entries(step.inputs || {})) {
      inputs[key] = this.resolveVariable(value as string);
    }

    // Execute action based on type
    let result: any;
    switch (action.type) {
      case 'function':
        result = await this.executeFunction(action.handler, inputs);
        break;
      case 'api':
        result = await this.executeApi(action.endpoint, action.method, inputs);
        break;
      case 'condition':
        result = await this.executeCondition(action.handler, inputs);
        break;
      case 'storage':
        result = await this.executeStorage(action.handler, inputs);
        break;
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }

    // Store output variables
    if (step.outputs) {
      for (const [key, varName] of Object.entries(step.outputs)) {
        const variableName = (varName as string).replace('${', '').replace('}', '');
        this.context.variables.set(variableName, result[key]);
      }
    }
  }

  private resolveVariable(value: string): any {
    if (!value.startsWith('${') || !value.endsWith('}')) {
      return value;
    }

    const varName = value.slice(2, -1);
    
    // Check for config values
    if (varName.startsWith('config.')) {
      const configPath = varName.slice(7);
      return this.getConfigValue(configPath);
    }

    return this.context.variables.get(varName) || value;
  }

  private getConfigValue(path: string): any {
    const parts = path.split('.');
    let value = this.workflow.config;
    
    for (const part of parts) {
      value = value[part];
      if (value === undefined) break;
    }
    
    return value;
  }

  private async executeFunction(handler: string, inputs: any): Promise<any> {
    // Import and execute handler functions
    const handlers = await import('./handlers');
    const fn = handlers[handler];
    
    if (!fn) {
      throw new Error(`Handler not found: ${handler}`);
    }
    
    return fn(inputs, this.context);
  }

  private async executeApi(endpoint: string, method: string, inputs: any): Promise<any> {
    const response = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inputs),
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    return response.json();
  }

  private async executeCondition(handler: string, inputs: any): Promise<any> {
    const handlers = await import('./handlers');
    const fn = handlers[handler];
    
    if (!fn) {
      throw new Error(`Handler not found: ${handler}`);
    }
    
    return fn(inputs, this.context);
  }

  private async executeStorage(handler: string, inputs: any): Promise<any> {
    const handlers = await import('./handlers');
    const fn = handlers[handler];
    
    if (!fn) {
      throw new Error(`Handler not found: ${handler}`);
    }
    
    return fn(inputs, this.context);
  }
}
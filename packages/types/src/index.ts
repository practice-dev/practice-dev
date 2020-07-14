export type TestResult =
  | 'pass'
  | 'fail'
  | 'pending'
  | 'running'
  | 'fail-skipped';

export interface Step {
  text: string;
  data?: any;
}

export interface TestInfo {
  id: number;
  name: string;
  error?: string;
  steps: Step[];
  result: TestResult;
}

export type SocketMessage =
  | {
      type: 'TEST_INFO';
      meta: {
        id: string;
      };
      payload: {
        tests: TestInfo[];
      };
    }
  | {
      type: 'STARTING_TEST';
      meta: {
        id: string;
      };
      payload: {
        testId: number;
      };
    }
  | {
      type: 'TEST_FAIL';
      meta: {
        id: string;
      };
      payload: {
        testId: number;
        error: string;
      };
    }
  | {
      type: 'TEST_PASS';
      meta: {
        id: string;
      };
      payload: {
        testId: number;
      };
    }
  | {
      type: 'STEP';
      meta: {
        id: string;
      };
      payload: {
        testId: number;
        text: string;
        data: any;
      };
    }
  | {
      type: 'RESULT';
      meta: {
        id: string;
      };
      payload: {
        success: boolean;
      };
    };

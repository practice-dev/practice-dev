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

export interface TesterSocketMessageMeta {
  submissionId: string;
}

export type TesterSocketMessage =
  | {
      type: 'TEST_INFO';
      meta: TesterSocketMessageMeta;
      payload: {
        tests: TestInfo[];
      };
    }
  | {
      type: 'TEST_START';
      meta: TesterSocketMessageMeta;
      payload: {
        testId: number;
      };
    }
  | {
      type: 'TEST_FAIL';
      meta: TesterSocketMessageMeta;
      payload: {
        testId: number;
        error: string;
      };
    }
  | {
      type: 'TEST_PASS';
      meta: TesterSocketMessageMeta;
      payload: {
        testId: number;
      };
    }
  | {
      type: 'TEST_STEP';
      meta: TesterSocketMessageMeta;
      payload: {
        testId: number;
        text: string;
        data: any;
      };
    }
  | {
      type: 'TEST_RESULT';
      meta: TesterSocketMessageMeta;
      payload: {
        success: boolean;
      };
    };

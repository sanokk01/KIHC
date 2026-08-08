export interface ContactInquiry {
  name: string;
  email: string;
  organization?: string;
  message: string;
}

export interface ContactSubmissionResult {
  accepted: boolean;
  message: string;
}

/**
 * Contact delivery boundary.
 * Replace this implementation with the team's API call after its endpoint and
 * authentication rules are confirmed. It intentionally does not pretend that
 * an email or database record was created while the service is disconnected.
 */
export async function submitContactInquiry(_inquiry: ContactInquiry): Promise<ContactSubmissionResult> {
  void _inquiry;
  return {
    accepted: false,
    message: "문의 접수 기능은 현재 준비 중입니다. 대표 연락처가 확정되면 이 화면에서 접수할 수 있습니다.",
  };
}

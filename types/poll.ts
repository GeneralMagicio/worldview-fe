export interface IPoll {
  authorUserId: number;
  creationDate: string;
  description: string;
  endDate: string;
  isAnonymous: boolean;
  options: string[];
  participantCount: number;
  pollId: number;
  startDate: string;
  tags: string[];
  title: string;
  voteResults: IVoteResult[];
}

export interface IVoteResult {
  optionId: number;
  voteCount: number;
}

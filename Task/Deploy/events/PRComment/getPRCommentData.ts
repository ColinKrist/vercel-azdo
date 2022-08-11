import {
  Localizations,
  localizationFile,
  localizationPath,
} from "../../localization";

export interface PullRequestCommentsData {
  name: string;
  status: string;
  url?: string;
  inspectorUrl?: string;
  updatedAt: number;
}

export const getPRCommentData = (event: PullRequestCommentsData): string => {
  const loc = new Localizations(localizationPath, localizationFile);
  const prCommentList = [
    loc.getLocalization("comment.title"),
    loc.getLocalization("comment.break"),
    loc.getLocalization("comment.table.title"),
    loc.getLocalization("comment.table.break"),
    loc
      .getLocalization("comment.table.row")
      .replace("{name}", event.name)
      .replace("{status}", event.status)
      .replace("{url}", `https://${event.url}` ?? "")
      .replace("{inspectorUrl}", event.inspectorUrl ?? "")
      .replace("{updatedAt}", new Date(event.updatedAt).toUTCString()),
    loc.getLocalization("comment.break"),
    loc.getLocalization("comment.footer"),
  ];

  return prCommentList.join("\n");
};

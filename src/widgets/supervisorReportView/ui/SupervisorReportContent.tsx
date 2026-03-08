import { type RefObject } from "react";
import { useTranslation } from "react-i18next";
import { FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface SupervisorReportContentProps {
    content: string | null;
    hasReport: boolean;
    contentRef?: RefObject<HTMLDivElement | null>;
}

export const SupervisorReportContent = ({
    content,
    hasReport,
    contentRef,
}: SupervisorReportContentProps) => {
    const { t } = useTranslation();

    if (!hasReport) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <FileText className="h-12 w-12 text-muted-foreground/40" />
                <p className="text-muted-foreground text-sm max-w-xs">
                    {t("supervisorReports.noReport")}
                </p>
            </div>
        );
    }

    if (!content) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <FileText className="h-12 w-12 text-muted-foreground/40" />
                <p className="text-muted-foreground text-sm max-w-xs">
                    {t("supervisorReports.noContent")}
                </p>
            </div>
        );
    }

    return (
        <div ref={contentRef} className="text-sm leading-relaxed">
            <ReactMarkdown
                components={{
                    h1: ({ children }) => (
                        <h1 className="text-lg font-bold mt-4 mb-2 first:mt-0">{children}</h1>
                    ),
                    h2: ({ children }) => (
                        <h2 className="text-base font-semibold mt-4 mb-2 first:mt-0">{children}</h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="text-sm font-semibold mt-3 mb-1 first:mt-0">{children}</h3>
                    ),
                    h4: ({ children }) => (
                        <h4 className="text-xs font-semibold mt-2 mb-1 first:mt-0">{children}</h4>
                    ),
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    strong: ({ children }) => (
                        <strong className="font-semibold">{children}</strong>
                    ),
                    em: ({ children }) => <em className="italic">{children}</em>,
                    ul: ({ children }) => (
                        <ul className="my-2 ml-4 list-disc space-y-1">{children}</ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="my-2 ml-4 list-decimal space-y-1">{children}</ol>
                    ),
                    li: ({ children }) => (
                        <li className="leading-relaxed">{children}</li>
                    ),
                    hr: () => <hr className="my-3 border-border" />,
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-2 border-border pl-3 my-2 text-muted-foreground italic">
                            {children}
                        </blockquote>
                    ),
                    code: ({ children }) => (
                        <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">
                            {children}
                        </code>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

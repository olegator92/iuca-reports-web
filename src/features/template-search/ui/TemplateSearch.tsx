import { Button, Input } from "@/shared/ui";
import { useTemplateSearch } from "../model";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

export const TemplateSearch = () => {
    const { search, setSearch } = useTemplateSearch();
    const { t } = useTranslation();

    return (
        <div className="relative w-full">
            <Input
                type="text"
                placeholder={t("common.searchPlaceholder")}
                aria-label={t("common.searchAria")}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pr-10"
            />

            {search && (
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setSearch("")}
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={t("common.clearSearch")}
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
};

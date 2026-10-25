import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import { CogIcon } from "@sanity/icons/Cog";
import { TagIcon } from "@sanity/icons/Tag";
import { UserIcon } from "@sanity/icons/User";
import type { StructureResolver } from "sanity/structure";

// The Studio sidebar: singletons first, then drag-to-reorder brands.
export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site settings")
        .icon(CogIcon)
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.listItem()
        .title("About")
        .icon(UserIcon)
        .child(S.document().schemaType("about").documentId("about")),
      S.divider(),
      orderableDocumentListDeskItem({ type: "brand", title: "Brands", icon: TagIcon, S, context }),
      S.documentTypeListItem("experience").title("Experience"),
      S.documentTypeListItem("education").title("Education"),
    ]);

// src/design-system/components/typography/ui/rich-text-editor.preset.tsx

"use client";

import type { RichEditorPresetProps } from "@/design-system/components/typography/types/rich-text-editor.type";
import {
  Control,
  RichTextEditor,
} from "@/design-system/components/typography/ui/rich-text-editor";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { t } from "@/shared/libs/i18n";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export const RichTextEditorPresetEssential = (props: RichEditorPresetProps) => {
  // Props
  const { editorOptions, ...rootProps } = props;

  // Stores
  const { theme } = useThemeStore();

  // Hooks
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyleKit,
      Highlight,
      TextAlign.configure({ types: ["paragraph", "heading"] }),
      Placeholder.configure({
        placeholder: t["rich_text_editor.default_placeholder"](),
      }),
      Subscript,
      Superscript,
    ],
    content: "",
    shouldRerenderOnTransaction: true,
    immediatelyRender: false,
    ...editorOptions,
  });

  if (!editor) return null;

  return (
    <RichTextEditor.Root
      editor={editor}
      borderWidth={"1px"}
      rounded={theme.radii.component}
      {...rootProps}
    >
      <RichTextEditor.Toolbar>
        <RichTextEditor.ControlGroup>
          <Control.Undo />
          <Control.Redo />
        </RichTextEditor.ControlGroup>

        {/* <RichTextEditor.ControlGroup> */}
        {/* <Control.FontSize /> */}
        {/* <Control.TextColor /> */}
        {/* <Control.Highlight /> */}
        {/* </RichTextEditor.ControlGroup> */}

        <RichTextEditor.ControlGroup>
          <Control.Bold />
          <Control.Italic />
          <Control.Underline />
          <Control.Strikethrough />
        </RichTextEditor.ControlGroup>

        <RichTextEditor.ControlGroup>
          <Control.AlignLeft />
          <Control.AlignCenter />
          <Control.AlignRight />
          <Control.AlignJustify />
        </RichTextEditor.ControlGroup>

        <RichTextEditor.ControlGroup>
          <Control.H1 />
          <Control.H2 />
          <Control.H3 />
        </RichTextEditor.ControlGroup>

        <RichTextEditor.ControlGroup>
          <Control.BulletList />
          <Control.OrderedList />
        </RichTextEditor.ControlGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor.Root>
  );
};

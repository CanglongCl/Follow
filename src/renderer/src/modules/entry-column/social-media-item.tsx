import { FeedIcon } from "@renderer/components/feed-icon"
import { RelativeTime } from "@renderer/components/ui/datetime"
import { Image } from "@renderer/components/ui/image"
import { usePreviewImages } from "@renderer/components/ui/image/hooks"
import { useAsRead } from "@renderer/hooks/biz/useAsRead"
import { cn } from "@renderer/lib/utils"
import { useEntry } from "@renderer/store/entry/hooks"
import { useFeedById } from "@renderer/store/feed"

import { ReactVirtuosoItemPlaceholder } from "../../components/ui/placeholder"
import { StarIcon } from "./star-icon"
import { EntryTranslation } from "./translation"
import type { EntryListItemFC } from "./types"

export const SocialMediaItem: EntryListItemFC = ({
  entryId,
  entryPreview,
  translation,
}) => {
  const entry = useEntry(entryId) || entryPreview

  const previewImage = usePreviewImages()
  const asRead = useAsRead(entry)
  const feed = useFeedById(entry?.feedId)

  // NOTE: prevent 0 height element, react virtuoso will not stop render any more
  if (!entry || !feed) return <ReactVirtuosoItemPlaceholder />

  return (
    <div
      className={cn(
        "relative flex py-3 pl-3 pr-2",
        !asRead &&
        // "before:absolute before:-left-4 before:top-[22px] before:block before:size-2 before:rounded-full before:bg-theme-accent",
        "bg-theme-accent/15",
      )}
    >
      <FeedIcon
        className="mask-squircle mask"
        feed={feed}
        entry={entry.entries}
        size={36}
      />
      <div className="ml-2 min-w-0 flex-1">
        <div
          className={cn(
            "-mt-0.5 flex-1 text-sm",
            entry.entries.description && "line-clamp-5",
          )}
        >
          <div className="space-x-1">
            <span className="font-semibold">{entry.entries.author}</span>
            <span className="text-zinc-500">·</span>
            <span className="text-zinc-500">
              <RelativeTime date={entry.entries.publishedAt} />
            </span>
          </div>
          <div
            className={cn(
              "relative mt-0.5 whitespace-pre-line text-base",
              !!entry.collections && "pr-5",
            )}
          >
            <EntryTranslation
              source={entry.entries.description}
              target={translation?.description}
            />
            {!!entry.collections && <StarIcon />}
          </div>
        </div>
        <div className="mt-1 flex gap-2 overflow-x-auto">
          {entry.entries.images?.map((image, i, images) => (
            <Image
              key={image}
              src={image}
              className="size-28 shrink-0"
              loading="lazy"
              proxy={{
                width: 224,
                height: 224,
              }}
              onClick={(e) => {
                previewImage(images, i)
                e.stopPropagation()
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

SocialMediaItem.wrapperClassName = tw`w-[75ch] m-auto hover:bg-theme-item-hover`

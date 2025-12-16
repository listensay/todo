import { Modal, ScrollArea } from "@mantine/core";
import { ContributionCalendar } from "./ContributionCalendar";

interface StatsModalProps {
  opened: boolean;
  onClose: () => void;
}

export function StatsModal({ opened, onClose }: StatsModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="活动统计"
      centered
      radius={0}
      size="lg"
      classNames={{
        header: "border-b-2 border-black font-bold",
        body: "p-4",
        content:
          "border-2 border-black rounded-none shadow-[4px_4px_0_0_rgba(0,0,0,1)]",
      }}
    >
      <ScrollArea>
        <div className="py-2">
          <ContributionCalendar />
        </div>
      </ScrollArea>
    </Modal>
  );
}

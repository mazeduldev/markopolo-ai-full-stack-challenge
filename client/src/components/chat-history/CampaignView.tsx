import type { Campaign } from "@/types/campaign.type";
import {
  Eye,
  Code,
  Users,
  MessageSquare,
  DollarSign,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";

export function CampaignView({ campaign }: { campaign: Campaign }) {
  const [showJson, setShowJson] = useState(false);

  return (
    <Card className="border-0 p-0">
      <CardHeader className="p-0">
        <div className="flex w-full justify-between items-center gap-2">
          <Badge>Campaign</Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowJson(!showJson)}
            className="flex items-center gap-2"
          >
            {showJson ? (
              <>
                <Eye className="w-4 h-4" />
                Campaign
              </>
            ) : (
              <>
                <Code className="w-4 h-4" />
                JSON
              </>
            )}
          </Button>
        </div>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg flex items-center">
            {campaign.campaign_title}
          </CardTitle>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="space-y-4 p-0">
        {showJson ? (
          <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm max-w-full whitespace-pre-wrap">
            <code>{JSON.stringify(campaign, null, 2)}</code>
          </pre>
        ) : (
          <>
            <div>
              <h4 className="font-medium mb-1 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Target Audience
              </h4>
              <p className="text-sm text-muted-foreground">
                {campaign.target_audience}
              </p>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Message
              </h4>
              <div className="space-y-2">
                <p className="font-medium text-sm">
                  {campaign.message.headline}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {campaign.message.body}
                </p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <div>
                  <span className="font-medium">Budget:</span>
                  <p>{campaign.budget}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <div>
                  <span className="font-medium">Timeline:</span>
                  <p>
                    {new Date(
                      campaign.timeline.start_date,
                    ).toLocaleDateString()}{" "}
                    -{" "}
                    {new Date(campaign.timeline.end_date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                <span className="font-medium">Channels:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {campaign.channels.map((channel) => (
                    <Badge key={channel} variant="outline" className="text-xs">
                      {channel}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-2">Expected Metrics</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Open Rate:</span>
                  <p className="font-medium">
                    {campaign.expected_metrics.open_rate}%
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Click Rate:</span>
                  <p className="font-medium">
                    {campaign.expected_metrics.click_rate}%
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Conversion:</span>
                  <p className="font-medium">
                    {campaign.expected_metrics.conversion_rate}%
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">ROI:</span>
                  <p className="font-medium">
                    {campaign.expected_metrics.roi}x
                  </p>
                </div>
              </div>
            </div>

            {campaign.message.call_to_action && (
              <Button asChild className="w-full">
                <a
                  href={campaign.message.call_to_action.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  {campaign.message.call_to_action.label}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

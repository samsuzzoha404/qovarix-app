import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { GlassCard } from '@/components/ui/glass-card';
import { SectionHeader } from '@/components/ui/section-header';
import { ResultBadge } from '@/components/bet/ResultBadge';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useRoundsHistory } from '@/hooks/useRoundsHistory';
import { formatNumber, formatTimestamp } from '@/lib/utils';
import { ChevronLeft, ChevronRight, History } from 'lucide-react';

export default function RoundsHistory() {
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const { data: rounds, isLoading } = useRoundsHistory(100);

  const paginatedRounds = rounds?.slice(page * pageSize, (page + 1) * pageSize) || [];
  const totalPages = rounds ? Math.ceil(rounds.length / pageSize) : 0;

  return (
    <MainLayout>
      <div className="container py-10 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">Rounds History</h1>
          <p className="text-sm text-muted-foreground">
            Complete history of all past rounds and their results
          </p>
        </div>

        <GlassCard className="overflow-hidden p-0">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              <div className="px-6 pt-5 pb-4 border-b border-border/50">
                <SectionHeader title={`${rounds?.length ?? 0} Rounds`} />
              </div>

              <div className="overflow-x-auto">
                {paginatedRounds.length > 0 ? (
                  <table className="w-full ds-table">
                    <thead>
                      <tr>
                        <th>Round</th>
                        <th>Start Price</th>
                        <th>End Price</th>
                        <th>Change</th>
                        <th className="text-center">Result</th>
                        <th>Total Pool</th>
                        <th>Winners Pool</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedRounds.map((round) => {
                        const priceChange = round.endPrice && round.startPrice
                          ? ((round.endPrice - round.startPrice) / round.startPrice) * 100
                          : 0;
                        const winnersPool = round.result === 'UP' ? round.downPool : round.upPool;

                        return (
                          <tr key={round.id}>
                            <td className="font-mono tabular-nums">#{round.id}</td>
                            <td className="text-right font-mono tabular-nums">
                              ${formatNumber(round.startPrice)}
                            </td>
                            <td className="text-right font-mono tabular-nums">
                              {round.endPrice ? `$${formatNumber(round.endPrice)}` : '—'}
                            </td>
                            <td className={`text-right font-mono tabular-nums text-sm ${priceChange >= 0 ? 'text-up' : 'text-down'}`}>
                              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                            </td>
                            <td className="text-center">
                              <ResultBadge direction={round.result} size="sm" />
                            </td>
                            <td className="text-right font-mono tabular-nums">
                              {formatNumber(round.totalPool)} QVX
                            </td>
                            <td className="text-right font-mono tabular-nums">
                              {formatNumber(winnersPool)} QVX
                            </td>
                            <td className="text-right text-xs text-muted-foreground tabular-nums">
                              {formatTimestamp(round.startTick * 1000)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <EmptyState
                    icon={<History className="h-5 w-5 text-muted-foreground" />}
                    title="No rounds yet"
                    description="Completed rounds will appear here once trading begins."
                  />
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-border/50">
                  <div className="text-xs text-muted-foreground">
                    {page * pageSize + 1}–{Math.min((page + 1) * pageSize, rounds?.length || 0)} of {rounds?.length || 0}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(0, p - 1))}
                      disabled={page === 0}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Prev
                    </Button>
                    <span className="text-xs text-muted-foreground px-2">
                      {page + 1} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                      disabled={page >= totalPages - 1}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </GlassCard>
      </div>
    </MainLayout>
  );
}

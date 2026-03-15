import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { GlassCard } from '@/components/ui/glass-card';
import { ResultBadge } from '@/components/bet/ResultBadge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useRoundsHistory } from '@/hooks/useRoundsHistory';
import { formatNumber, formatTimestamp } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function RoundsHistory() {
  const [page, setPage] = useState(0);
  const pageSize = 20;
  
  const { data: rounds, isLoading } = useRoundsHistory(100);

  const paginatedRounds = rounds?.slice(page * pageSize, (page + 1) * pageSize) || [];
  const totalPages = rounds ? Math.ceil(rounds.length / pageSize) : 0;

  return (
    <MainLayout>
      <div className="container py-10 max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">Rounds History</h1>
          <p className="text-lg text-muted-foreground">
            Complete history of all past rounds and their results
          </p>
        </div>

        <GlassCard className="overflow-hidden shadow-2xl">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/60">
                    <tr className="text-sm text-foreground/80 font-semibold uppercase tracking-wider">
                      <th className="text-left p-4">Round</th>
                      <th className="text-right p-4">Start Price</th>
                      <th className="text-right p-4">End Price</th>
                      <th className="text-right p-4">Change</th>
                      <th className="text-center p-4">Result</th>
                      <th className="text-right p-4">Total Pool</th>
                      <th className="text-right p-4">Winners Pool</th>
                      <th className="text-right p-4">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {paginatedRounds.map((round) => {
                      const priceChange = round.endPrice && round.startPrice
                        ? ((round.endPrice - round.startPrice) / round.startPrice) * 100
                        : 0;
                      const winnersPool = round.result === 'UP' ? round.downPool : round.upPool;

                      return (
                        <tr key={round.id} className="hover:bg-muted/40 transition-all duration-200">
                          <td className="p-4 font-mono font-medium">#{round.id}</td>
                          <td className="p-4 text-right font-mono">
                            ${formatNumber(round.startPrice)}
                          </td>
                          <td className="p-4 text-right font-mono">
                            {round.endPrice ? `$${formatNumber(round.endPrice)}` : '-'}
                          </td>
                          <td className={`p-4 text-right font-mono ${priceChange >= 0 ? 'text-up' : 'text-down'}`}>
                            {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                          </td>
                          <td className="p-4 text-center">
                            <ResultBadge direction={round.result} size="sm" />
                          </td>
                          <td className="p-4 text-right font-mono">
                            {formatNumber(round.totalPool)} QVX
                          </td>
                          <td className="p-4 text-right font-mono">
                            {formatNumber(winnersPool)} QVX
                          </td>
                          <td className="p-4 text-right text-sm text-muted-foreground">
                            {formatTimestamp(round.startTick * 1000)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between p-4 border-t border-border">
                <div className="text-sm text-muted-foreground">
                  Showing {page * pageSize + 1}-{Math.min((page + 1) * pageSize, rounds?.length || 0)} of {rounds?.length || 0}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="text-sm text-muted-foreground px-3">
                    Page {page + 1} of {totalPages}
                  </div>
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
            </>
          )}
        </GlassCard>
      </div>
    </MainLayout>
  );
}

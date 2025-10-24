import React, { useState } from 'react'
import styled from 'styled-components'
import {
  useLeaderboardData,
  Period,
  Player,
} from '../../hooks/useLeaderboardData'
import {
  ModalContent as BaseContent,
  HeaderSection,
  Title,
  Subtitle,
  TabRow,
  TabButton,
  LeaderboardList,
  ListHeader,
  HeaderRank,
  HeaderPlayer,
  HeaderVolume,
  RankItem,
  RankNumber,
  PlayerInfo,
  VolumeAmount,
  formatVolume,
  LoadingText,
  ErrorText,
  EmptyStateText,
} from './LeaderboardsModal.styles'

// Expand to the container width for embedded panel usage
const PanelContent = styled(BaseContent)`
  max-width: 100%;
  border-radius: 12px;
  background: rgba(37, 44, 55, 0.6); /* match FAQ item background */
  border: 1px solid rgba(255,255,255,0.08); /* match FAQ border */
`

const PanelWrapper = styled.div`
  width: 100%;
  margin: 16px auto;
`

interface LeaderboardsPanelProps {
  creator: string
  defaultPeriod?: Period // defaults to 'monthly'
}

const LeaderboardsPanel: React.FC<LeaderboardsPanelProps> = ({ creator, defaultPeriod = 'monthly' }) => {
  const [period, setPeriod] = useState<Period>(defaultPeriod)

  const { data: leaderboard, loading, error } = useLeaderboardData(period, creator)

  return (
    <PanelWrapper>
      <PanelContent>
        <HeaderSection>
          <Title>Leaderboard</Title>
          <Subtitle>
            Top players by volume{' '}
            {period === 'weekly' ? 'this week' : 'this month'} (USD)
          </Subtitle>
        </HeaderSection>

        <TabRow>
          <TabButton
            $selected={period === 'weekly'}
            onClick={() => setPeriod('weekly')}
            disabled={loading}
          >
            Weekly
          </TabButton>

          <TabButton
            $selected={period === 'monthly'}
            onClick={() => setPeriod('monthly')}
            disabled={loading}
          >
            Monthly
          </TabButton>
        </TabRow>

        {loading ? (
          <LoadingText>Loading...</LoadingText>
        ) : error ? (
          <ErrorText>{error}</ErrorText>
        ) : leaderboard && leaderboard.length > 0 ? (
          <LeaderboardList>
            <ListHeader>
              <HeaderRank>Rank</HeaderRank>
              <HeaderPlayer>Player</HeaderPlayer>
              <HeaderVolume>Volume&nbsp;(USD)</HeaderVolume>
            </ListHeader>

            {leaderboard.map((entry: Player, index) => {
              const rank = index + 1
              return (
                <RankItem key={entry.user} $isTop3={rank <= 3}>
                  <RankNumber rank={rank}>{rank > 3 ? rank : ''}</RankNumber>
                  <PlayerInfo title={entry.user}>{entry.user}</PlayerInfo>
                  <VolumeAmount>{formatVolume(entry.usd_volume)}</VolumeAmount>
                </RankItem>
              )
            })}
          </LeaderboardList>
        ) : (
          <EmptyStateText>No leaderboard data for this period.</EmptyStateText>
        )}
      </PanelContent>
    </PanelWrapper>
  )
}

export default LeaderboardsPanel

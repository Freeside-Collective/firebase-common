/**
 * Game state hooks for server-authoritative gameplay.
 *
 * @remarks
 * Provides React hooks for:
 * - Fetching initial game state from the realtime-server
 * - Subscribing to real-time updates via WebSocket
 * - Sending commands (mutations) to the server
 *
 * @module useGameState
 */
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import { gql } from '@apollo/client';

/**
 * GraphQL queries for fetching game state.
 */
const GET_GAME_STATE = gql`
  query GetGameState($regionId: String!, $playerId: String) {
    getGameState(regionId: $regionId, playerId: $playerId) {
      region {
        id
        width
        height
        name
        layers
        metadata
        zones
        routes
        structures
        musicTrack
        stats
      }
      players {
        id
        playerId
        name
        regionId
        x
        y
        facing
        stats
        inventory
        equipment
        activeStatuses
        experience
        level
      }
      entities {
        id
        assetId
        regionId
        logicKey
        posX
        posY
        facing
        state
        stats
      }
      combats {
        id
        regionId
        status
        turnIndex
        roundIndex
        combatants
        log
        startedAt
        endedAt
      }
      weather
      timestamp
    }
  }
`;

const GET_REGION = gql`
  query GetRegion($regionId: String!) {
    getRegion(regionId: $regionId) {
      id
      width
      height
      name
      layers
      metadata
      zones
      routes
      structures
      lastMutation
      lastRouteMutation
      lastWeatherMutation
      musicTrack
      stats
    }
  }
`;

const GET_CHARACTER = gql`
  query GetCharacter($playerId: String!) {
    getCharacter(playerId: $playerId) {
      id
      playerId
      name
      regionId
      x
      y
      facing
      stats
      inventory
      equipment
      activeStatuses
      experience
      level
    }
  }
`;

/**
 * GraphQL subscriptions for real-time updates.
 */
const ON_GAME_STATE_CHANGE = gql`
  subscription OnGameStateChange($regionId: String!) {
    onGameStateChange(regionId: $regionId) {
      type
      payload
      timestamp
    }
  }
`;

const ON_PLAYER_MOVE = gql`
  subscription OnPlayerMove($regionId: String!) {
    onPlayerMove(regionId: $regionId) {
      playerId
      x
      y
      facing
    }
  }
`;

const ON_TILE_MUTATION = gql`
  subscription OnTileMutation($regionId: String!) {
    onTileMutation(regionId: $regionId) {
      index
      logicKey
      damageState
      hp
    }
  }
`;

const ON_ENTITY_MUTATION = gql`
  subscription OnEntityMutation($regionId: String!) {
    onEntityMutation(regionId: $regionId) {
      id
      assetId
      posX
      posY
      facing
      state
      stats
      type
    }
  }
`;

const ON_COMBAT_MUTATION = gql`
  subscription OnCombatMutation($regionId: String!) {
    onCombatMutation(regionId: $regionId) {
      id
      status
      turnIndex
      roundIndex
      combatLog
      type
    }
  }
`;

/**
 * GraphQL mutations for commands.
 */
const MOVE_PLAYER = gql`
  mutation MovePlayer($playerId: String!, $regionId: String!, $x: Float!, $y: Int!, $facing: Int) {
    movePlayer(playerId: $playerId, regionId: $regionId, x: $x, y: $y, facing: $facing) {
      success
      playerId
      x
      y
      error
    }
  }
`;

const USE_ITEM = gql`
  mutation UseItem($playerId: String!, $itemId: String!, $targetId: String) {
    useItem(playerId: $playerId, itemId: $itemId, targetId: $targetId) {
      success
      playerId
      itemId
      effect
      error
    }
  }
`;

const ATTACK_TARGET = gql`
  mutation AttackTarget($playerId: String!, $targetId: String!) {
    attackTarget(playerId: $playerId, targetId: $targetId) {
      success
      combatId
      damage
      targetDefeated
      error
    }
  }
`;

const START_COMBAT = gql`
  mutation StartCombat($playerId: String!, $regionId: String!, $enemyIds: [String]!) {
    startCombat(playerId: $playerId, regionId: $regionId, enemyIds: $enemyIds) {
      id
      regionId
      status
      turnIndex
      roundIndex
      combatants
      log
      startedAt
    }
  }
`;

const END_COMBAT = gql`
  mutation EndCombat($combatId: String!) {
    endCombat(combatId: $combatId)
  }
`;

const INTERACT = gql`
  mutation Interact($playerId: String!, $regionId: String!, $targetIndex: Int!) {
    interact(playerId: $playerId, regionId: $regionId, targetIndex: $targetIndex) {
      success
      playerId
      targetIndex
      interactionType
      result
      error
    }
  }
`;

const JOIN_SESSION = gql`
  mutation JoinSession($playerId: String!, $regionId: String!) {
    joinSession(playerId: $playerId, regionId: $regionId) {
      playerId
      sessionId
      regionId
      connectedAt
      status
    }
  }
`;

const LEAVE_SESSION = gql`
  mutation LeaveSession($playerId: String!) {
    leaveSession(playerId: $playerId)
  }
`;

/**
 * Hook options for useGameState.
 */
export interface UseGameStateOptions {
  regionId: string;
  playerId?: string;
  subscribeToUpdates?: boolean;
}

/**
 * Game state data from the server.
 */
export interface GameStateData {
  region: Record<string, unknown> | null;
  players: Array<Record<string, unknown>>;
  entities: Array<Record<string, unknown>>;
  combats: Array<Record<string, unknown>>;
  weather: unknown;
  timestamp: string;
}

/**
 * Hook for fetching full game state from the server.
 *
 * @param options - Query options including regionId and playerId
 * @returns Apollo useQuery result
 */
export function useGameStateQuery(options: UseGameStateOptions) {
  return useQuery<GameStateData>(GET_GAME_STATE, {
    variables: { regionId: options.regionId, playerId: options.playerId },
    skip: !options.regionId,
    pollInterval: 0,
    fetchPolicy: 'network-only',
  });
}

/**
 * Hook for fetching a region from the server.
 *
 * @param regionId - The region ID to fetch
 * @returns Apollo useQuery result
 */
export function useRegionQuery(regionId: string | undefined) {
  return useQuery(GET_REGION, {
    variables: { regionId },
    skip: !regionId,
    fetchPolicy: 'network-only',
  });
}

/**
 * Hook for fetching a character from the server.
 *
 * @param playerId - The player ID to fetch
 * @returns Apollo useQuery result
 */
export function useCharacterQuery(playerId: string | undefined) {
  return useQuery(GET_CHARACTER, {
    variables: { playerId },
    skip: !playerId,
    fetchPolicy: 'network-only',
  });
}

/**
 * Hook for subscribing to game state changes.
 *
 * @param regionId - The region ID to subscribe to
 * @returns Apollo useSubscription result
 */
export function useGameStateSubscription(regionId: string | undefined) {
  return useSubscription(ON_GAME_STATE_CHANGE, {
    variables: { regionId },
    skip: !regionId,
  });
}

/**
 * Hook for subscribing to player moves.
 *
 * @param regionId - The region ID to subscribe to
 * @returns Apollo useSubscription result
 */
export function usePlayerMoveSubscription(regionId: string | undefined) {
  return useSubscription(ON_PLAYER_MOVE, {
    variables: { regionId },
    skip: !regionId,
  });
}

/**
 * Hook for subscribing to tile mutations.
 *
 * @param regionId - The region ID to subscribe to
 * @returns Apollo useSubscription result
 */
export function useTileMutationSubscription(regionId: string | undefined) {
  return useSubscription(ON_TILE_MUTATION, {
    variables: { regionId },
    skip: !regionId,
  });
}

/**
 * Hook for subscribing to entity mutations.
 *
 * @param regionId - The region ID to subscribe to
 * @returns Apollo useSubscription result
 */
export function useEntityMutationSubscription(regionId: string | undefined) {
  return useSubscription(ON_ENTITY_MUTATION, {
    variables: { regionId },
    skip: !regionId,
  });
}

/**
 * Hook for subscribing to combat mutations.
 *
 * @param regionId - The region ID to subscribe to
 * @returns Apollo useSubscription result
 */
export function useCombatMutationSubscription(regionId: string | undefined) {
  return useSubscription(ON_COMBAT_MUTATION, {
    variables: { regionId },
    skip: !regionId,
  });
}

/**
 * Hook for moving a player.
 *
 * @returns useMutation result for movePlayer
 */
export function useMovePlayer() {
  return useMutation(MOVE_PLAYER);
}

/**
 * Hook for using an item.
 *
 * @returns useMutation result for useItem
 */
export function useUseItem() {
  return useMutation(USE_ITEM);
}

/**
 * Hook for attacking a target.
 *
 * @returns useMutation result for attackTarget
 */
export function useAttackTarget() {
  return useMutation(ATTACK_TARGET);
}

/**
 * Hook for starting combat.
 *
 * @returns useMutation result for startCombat
 */
export function useStartCombat() {
  return useMutation(START_COMBAT);
}

/**
 * Hook for ending combat.
 *
 * @returns useMutation result for endCombat
 */
export function useEndCombat() {
  return useMutation(END_COMBAT);
}

/**
 * Hook for interacting with a tile/object.
 *
 * @returns useMutation result for interact
 */
export function useInteract() {
  return useMutation(INTERACT);
}

/**
 * Hook for joining a game session.
 *
 * @returns useMutation result for joinSession
 */
export function useJoinSession() {
  return useMutation(JOIN_SESSION);
}

/**
 * Hook for leaving a game session.
 *
 * @returns useMutation result for leaveSession
 */
export function useLeaveSession() {
  return useMutation(LEAVE_SESSION);
}

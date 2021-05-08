import React from 'react';
import styled from 'styled-components';

import { useAreFontLoaded } from '../../hooks/useAreFontsLoaded';
import { useGameKeys } from '../../hooks/useGameKeys';
import { generateLevel } from '../../pcg/generateLevel';
import { GameAction, GameState } from '../../reducers/game';
import { gameActions } from '../../reducers/game';
import { Canvas } from '../Canvas';
import { DoubleBorders } from '../Shared/DoubleBorders';
import { Viewport } from '../Shared/Viewport';
import { EventLogs } from './EventLogs';
import { InteractionText } from './InteractionText';
import { Inventory } from './Inventory';
import { PlayerStats } from './PlayerStats';

const Wrapper = styled.div`
  display: flex;
`;

const SideWrapper = styled.div`
  width: 230px;
  background-color: black;
  color: white;
`;

interface Props {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  withBackgroundMusic: boolean;
  setWithBackgroundMusic: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Game: React.FC<Props> = (props) => {
  const areFontsLoaded = useAreFontLoaded();
  useGameKeys(props.dispatch);

  React.useEffect(() => {
    if (props.state.currentMap === null) {
      const level = generateLevel();
      props.dispatch(gameActions.initPlayerSpawn(level.playerSpawn));
      props.dispatch(gameActions.setCurrentMap(level.gameMap));
    }
    props.dispatch(gameActions.initVisibility());
  }, []);

  if (!areFontsLoaded) {
    return null;
  }

  return (
    <div style={{ userSelect: 'none' }}>
      <EventLogs eventLogs={props.state.eventLogs} />
      <Wrapper>
        <SideWrapper
          style={{ marginRight: '15px', paddingRight: 5, paddingLeft: 5, boxSizing: 'border-box' }}
        >
          <PlayerStats
            characterName={props.state.characterName}
            hp={props.state.hp}
            maxHp={props.state.maxHp}
            gold={props.state.gold}
            equipedItems={props.state.equipedItems}
            withBackgroundMusic={props.withBackgroundMusic}
            setWithBackgroundMusic={props.setWithBackgroundMusic}
          />
        </SideWrapper>
        <div>
          <DoubleBorders>
            <Viewport>
              {props.state.currentMap && (
                <Canvas
                  playerPosition={props.state.playerPosition}
                  gameMap={props.state.currentMap}
                  moveDirection={props.state.moveDirection}
                  dispatch={props.dispatch}
                />
              )}
            </Viewport>
          </DoubleBorders>
        </div>
        <SideWrapper
          style={{
            marginLeft: '15px',
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column',
          }}
        >
          <Inventory inventory={props.state.inventory} />
        </SideWrapper>
      </Wrapper>
      <InteractionText interactionText={props.state.interactionText} />
    </div>
  );
};

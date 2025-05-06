/**
 * @brief Player interface for later scalability with different kinds of players, controllers, etc.
 */

export type ControllerType = 'keyboardAWSD' | 'keyboardArrows' | 'ai' | 'websocket';

export interface PlayerInfo
{
	id: string;
	controller: ControllerType;
	side: 'left' | 'right';
}

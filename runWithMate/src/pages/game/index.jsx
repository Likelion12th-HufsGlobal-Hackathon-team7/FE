import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import GameOver from "../../components/game/GameOver/GameOver";
import Map from "../../components/game/Map";
import GameInfo from "../../components/game/GameInfo";
import GameRanking from "../../components/game/GameRanking";
import useStomp from '../../hooks/useStomp';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MapContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

function Game() {
  const navigate = useNavigate();
  const { disconnect } = useStomp();
  const [timeLimit, setTimeLimit] = useState(3); // 기본값으로 3분 설정 (초 단위)
  const [isGameOver, setIsGameOver] = useState(false); // 게임 오버 상태 추가

  const [data, setData] = useState([]);
  
  useEffect(() => {
    const mock = [
      {
        "box_type": "dopamine",
        "id": 1,
        "lat": 30,
        "lng": 50,
        "box_amount": 10
      },
      {
        "box_type": "dopamine",
        "id": 2,
        "lat": 30,
        "lng": 50,
        "box_amount": 10
      },
      {
        "box_type": "dopamine",
        "id": 3,
        "lat": 30,
        "lng": 50,
        "box_amount": 10
      },
      {
        "box_type": "point",
        "id": 1,
        "lat": 30,
        "lng": 50,
        "box_amount": 10
      },
      {
        "box_type": "point",
        "id": 2,
        "lat": 30,
        "lng": 50,
        "box_amount": 10
      },
      {
        "box_type": "point",
        "id": 3,
        "lat": 30,
        "lng": 50,
        "box_amount": 10
      }
    ];

    setData(mock);
  }, []);

  useEffect(() => {
    // 데이터 그룹화
    const groupedData = data.reduce((acc, item) => {
      if (!acc[item.box_type]) {
        acc[item.box_type] = [];
      }
      acc[item.box_type].push(item);
      return acc;
    }, {});

    // 각각의 box_type에 대해 localStorage에 저장
    for (const [key, value] of Object.entries(groupedData)) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [data]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGameOver(true); // 게임 오버 상태 변경
      setTimeout(() => {
        navigate("/gameResult");
      }, 2000);
    }, timeLimit * 1000);

    return () => clearTimeout(timer); // clear the timer when the component is unmounted
  }, [timeLimit, navigate]);

  useEffect(() => {
    if (isGameOver) {
      disconnect();
    }
  }, [isGameOver, disconnect]);

  return (
    <>
      <Container>
        {isGameOver && <GameOver />}
        <GameInfo />
        <MapContainer>
          <Map />
        </MapContainer>
        <GameRanking />
      </Container>
    </>
  );
}

export default Game;

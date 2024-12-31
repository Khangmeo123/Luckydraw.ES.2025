import React, { useEffect } from 'react'
import './App.scss'
import SpinName from './Components/SpinName';
import ModalCongratulation from './Components/ModalCongratulation/ModalCongratulation';
import axios from 'axios';
export interface DataUser {
  ID?: number;
  FullName?: string;
  AccountName?: string;
  DonVi?: string;
  Ho?: string;
  Dem?: string;
  Ten?: string;
}

function App() {
  // const [count, setCount] = useState(0);
  // const [listData, setListData] = React.useState<DataUser[]>([]);
  const [listHo, setListHo] = React.useState<string[]>([]);
  const [listDem, setListDem] = React.useState<string[]>([]);
  const [listTen, setListTen] = React.useState<string[]>([]);


  const [currentLuckyUser, setCurrentLuckyUser] = React.useState<DataUser>({});


  const [playing, setPlaying] = React.useState<boolean>(false);

  const [openModal, setOpenModal] = React.useState<boolean>(false);

  useEffect(() => {
    axios.get("http://localhost:5000/list-user").then(response => {
      const data = response.data;
      // setListData(data);
      console.log("data", data);
      const listHoTmp: string[] = [];
      const listDemTmp: string[] = [];
      const listTenTmp: string[] = [];
      data.map((user: DataUser) => {
        if (user.Ho && !listHoTmp.includes(user.Ho)) {
          listHoTmp.push(user.Ho);
        }
        if (user.Dem && !listDemTmp.includes(user.Dem)) {
          listDemTmp.push(user.Dem);
        }
        if (user.Ten && !listTenTmp.includes(user.Ten)) {
          listTenTmp.push(user.Ten);
        }
      });
      setListHo(listHoTmp);
      setListDem(listDemTmp);
      setListTen(listTenTmp);
    });
  }, []);



  const handleClickStart = React.useCallback(() => {
    setPlaying(true);
    setCurrentLuckyUser({});
    axios.get("http://localhost:5000/get-lucky-user").then(response => {
      const luckyData = response.data;
      let luckyUser = {};
      setTimeout(() => {
        luckyUser = {
          Ho: luckyData?.Ho,
        }
        setCurrentLuckyUser(luckyUser);
        setTimeout(() => {
          luckyUser = {
            Ho: luckyData?.Ho,
            Dem: luckyData?.Dem,
          }
          setCurrentLuckyUser(luckyUser);
          setTimeout(() => {
            luckyUser = luckyData;
            setCurrentLuckyUser(luckyUser);
            setPlaying(false);
            setOpenModal(true);
          }, 1000)
        }, 1000);
      }, 1000);
    })
  }, []);

  const handleSave = React.useCallback((luckyUser: DataUser) => {
    axios.post("http://localhost:5000/update-lucky-user", luckyUser).then(response => {
      console.log("update done", response.data);
    });
    setOpenModal(false);
  }, []);

  const handleCancel = React.useCallback(() => {
    setOpenModal(false);
  }, [])


  return (
    <div className='app-container'>
      <div className='app-background'>
      </div>
      <div className='app-content'>
        <div className='app-block-draw'>
          <div className='app-block-name'>
            <div className='app-block-each-name'>
              <div className='draw-name'>
                <SpinName playing={playing} listData={listHo} valueSelected={currentLuckyUser.Ho} placeholder='Họ' />
              </div>
            </div>
            <div className='app-block-each-name'>
              <div className='draw-name'> <SpinName playing={playing} listData={listDem} valueSelected={currentLuckyUser.Dem} placeholder="Đệm" /></div>
            </div>
            <div className='app-block-each-name'>
              <div className='draw-name'><SpinName playing={playing} listData={listTen} valueSelected={currentLuckyUser.Ten} placeholder="Tên" /></div>
            </div>
          </div>
          <div className='random-button' onClick={() => handleClickStart()}>Quay</div>
        </div>
        <div className="list-lucky-user">
          <div className='title'>Danh sách trúng thưởng</div>
          <div className="list-user">
            <div className="user-lucky">
              <div className="stt">1</div>
              <div className='user-name'>Đinh Minh Khang</div>
            </div>
            <div className="user-lucky">
              <div className="stt">2</div>
              <div className='user-name'>Nguyễn Huy Fuck Đạt</div>
            </div>
            <div className="user-lucky">
              <div className="stt">3</div>
              <div className='user-name'>Nguyễn Khánh Duy</div>
            </div>
            <div className="user-lucky">
              <div className="stt">4</div>
              <div className='user-name'>Nguyễn Kiên Cường</div>
            </div>
          </div>
        </div>
      </div>
      <ModalCongratulation isOpen={openModal} currentLuckyUser={currentLuckyUser} handleSave={() => handleSave(currentLuckyUser)} handleCancel={() => handleCancel()} />
    </div>
  )
}

export default App

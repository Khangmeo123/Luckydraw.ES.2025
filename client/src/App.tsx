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
  Giai?: number;
}

function App() {
  // const [count, setCount] = useState(0);
  const [listLuckyUser, setListLuckyUser] = React.useState<DataUser[]>([]);
  const [listHo, setListHo] = React.useState<string[]>([]);
  const [listDem, setListDem] = React.useState<string[]>([]);
  const [listTen, setListTen] = React.useState<string[]>([]);


  const [currentLuckyUser, setCurrentLuckyUser] = React.useState<DataUser>({});


  const [playing, setPlaying] = React.useState<boolean>(false);

  const [openModal, setOpenModal] = React.useState<boolean>(false);

  const [loading, setLoading] = React.useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:5000/list-user").then(response => {
      const data = response.data;
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
    axios.get("http://localhost:5000/list-lucky-user").then((response) => {
      setListLuckyUser(response.data);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    })
  }, []);



  const handleClickStart = React.useCallback(() => {
    axios.get("http://localhost:5000/get-lucky-user").then(response => {
      if (typeof response.data === "string") {
        alert(response.data)
      } else {
        setCurrentLuckyUser({});
        setPlaying(true);
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
      }

    })
  }, []);

  const handleSave = React.useCallback((luckyUser: DataUser) => {
    setLoading(true);
    axios.post("http://localhost:5000/update-lucky-user", luckyUser).then(response => {
      if (response.data === true) {
        axios.get("http://localhost:5000/list-lucky-user").then((response) => {
          setListLuckyUser(response.data);
          setLoading(false);
        }).catch(() => {
          setLoading(false);
        })
      } else {
        setLoading(false);
      }
    }).catch(() => {
      setLoading(false);
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
            {listLuckyUser?.length > 0 ? listLuckyUser?.map((luckyUser, index) => {
              return <div className="user-lucky" key={luckyUser?.ID}>
                <div className="stt">{index + 1}</div>
                <div className='user-name'>{luckyUser?.FullName}</div>
              </div>
            }) : <></>}
          </div>
        </div>
      </div>
      <ModalCongratulation isOpen={openModal} currentLuckyUser={currentLuckyUser} handleSave={() => handleSave(currentLuckyUser)} handleCancel={() => handleCancel()} />
    </div>
  )
}

export default App

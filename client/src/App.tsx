import type { PopconfirmProps } from 'antd';
import { Button, message, Popconfirm } from 'antd';
import axios from 'axios';
import React, { useEffect } from 'react';
import './App.scss';
import ModalCongratulation from './Components/ModalCongratulation/ModalCongratulation';
import SpinName from './Components/SpinName';
export interface DataUser {
  Id?: number;
  Email?: string;
  FullName?: string;
  Avatar?: string;
  WishForES?: string;
  Giai?: string;
  Checkin?: number;
  Checkout?: number;
}

function App() {
  // const [count, setCount] = useState(0);
  const [listLuckyUser, setListLuckyUser] = React.useState<DataUser[]>([]);
  const [listHo, setListHo] = React.useState<string[]>([]);
  const [listDem, setListDem] = React.useState<string[]>([]);
  const [listTen, setListTen] = React.useState<string[]>([]);


  const [currentLuckyUser, setCurrentLuckyUser] = React.useState<DataUser>({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [fakingLuckyUser, setFakingLuckyUser] = React.useState<any>({});


  const [playing, setPlaying] = React.useState<boolean>(false);

  const [openModal, setOpenModal] = React.useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = React.useState<boolean>(false);

  const getPartName = React.useCallback((fullName?: string, part?: string) => {
    const [Ten, Ho, ...Dem] = fullName?.split(' ') || [];
    if (part === 'Ten') {
      return Ten;
    }
    if (part === 'Ho') {
      return Ho;
    }
    if (part === 'Dem') {
      return Dem.join(' ');
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:5000/list-user").then(response => {
      const data = response.data;
      const listHoTmp: string[] = [];
      const listDemTmp: string[] = [];
      const listTenTmp: string[] = [];
      data.map((user: DataUser) => {
        const [Ten, Ho, ...Dem] = user.FullName?.split(' ') || [];
        if (Ho && !listHoTmp.includes(Ho)) {
          listHoTmp.push(Ho);
        }
        if (Dem && !listDemTmp.includes(Dem.join(' '))) {
          listDemTmp.push(Dem.join(' '));
        }
        if (Ten && !listTenTmp.includes(Ten)) {
          listTenTmp.push(Ten);
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
        message.error(response.data);
      } else {
        const luckyData = response.data;
        setCurrentLuckyUser(luckyData);
        setFakingLuckyUser({})
        setPlaying(true);

        let luckyUser = {};
        setTimeout(() => {
          luckyUser = {
            Ho: getPartName(luckyData?.FullName, "Ho"),
          }
          setFakingLuckyUser(luckyUser);
          setTimeout(() => {
            luckyUser = {
              Ho: getPartName(luckyData?.FullName, "Ho"),
              Dem: getPartName(luckyData?.FullName, "Dem"),
            }
            setFakingLuckyUser(luckyUser);
            setTimeout(() => {
              luckyUser = {
                Ho: getPartName(luckyData?.FullName, "Ho"),
                Dem: getPartName(luckyData?.FullName, "Dem"),
                Ten: getPartName(luckyData?.FullName, "Ten"),
              }
              setFakingLuckyUser(luckyUser);
              setPlaying(false);
              setOpenModal(true);
            }, 1000)
          }, 1000);
        }, 1000);
      }

    })
  }, [getPartName]);

  const handleSave = React.useCallback((luckyUser: DataUser) => {
    setLoading(true);
    axios.post("http://localhost:5000/update-lucky-user", luckyUser).then(response => {
      if (response.data === true) {
        axios.get("http://localhost:5000/list-lucky-user").then((response) => {
          setListLuckyUser(response.data);
          setLoading(false);
          message.success('Cập nhật thành công');
        }).catch(() => {
          setLoading(false);
        })
      } else {
        message.error('Cập nhật thất bại');
        setLoading(false);
      }
    }).catch(() => {
      message.error('Cập nhật thất bại');
      setLoading(false);
    });
    setOpenModal(false);
  }, []);

  const handleCancel = React.useCallback(() => {
    setOpenModal(false);
  }, []);

  const confirm: PopconfirmProps['onConfirm'] = () => {
    setLoading(true);
    axios.get("http://localhost:5000/reset").then((response) => {
      setListLuckyUser([]);
      if (response.data) {
        message.success('Reset dữ liệu thành công');
      } else {
        message.error('Reset dữ liệu thất bại');
      }
      setLoading(false);
    }).catch(() => {
      message.error('Reset dữ liệu thất bại');
      setLoading(false);
    })
  };


  return (
    <div className='app-container'>
      <div className='app-background'>
      </div>
      <div className='app-content'>
        <div className='app-block-draw'>
          <div className='app-block-name'>
            <div className='app-block-each-name'>
              <div className='draw-name'>
                <SpinName playing={playing} listData={listHo} valueSelected={fakingLuckyUser?.Ho} placeholder='Họ' />
              </div>
            </div>
            <div className='app-block-each-name'>
              <div className='draw-name'> <SpinName playing={playing} listData={listDem} valueSelected={fakingLuckyUser?.Dem} placeholder="Đệm" /></div>
            </div>
            <div className='app-block-each-name'>
              <div className='draw-name'><SpinName playing={playing} listData={listTen} valueSelected={fakingLuckyUser?.Ten} placeholder="Tên" /></div>
            </div>
          </div>
          <div className='random-button' onClick={() => handleClickStart()}>Quay</div>
        </div>
        <div className="list-lucky-user">
          <div className='title'>Danh sách trúng thưởng</div>
          <div className="list-user">
            {listLuckyUser?.length > 0 ? listLuckyUser?.map((luckyUser, index) => {
              const [Ten, Ho, ...Dem] = luckyUser?.FullName?.split(' ') || [];
              return <div className="user-lucky" key={luckyUser?.Id}>
                <div className="stt">{index + 1}</div>
                <div className='user-name'>{Ho + " " + Dem + " " + Ten}</div>
              </div>
            }) : <></>}
          </div>

          <div className="footer-action-reset">
            <Popconfirm
              title="Reset dữ liệu"
              description="Bạn có chắc chắn muốn reset dữ liệu?"
              onConfirm={confirm}
              okText="Xác nhận"
              cancelText="Huỷ"

            >
              <Button danger>Reset</Button>
            </Popconfirm>
          </div>
        </div>
      </div>
      <ModalCongratulation isOpen={openModal} currentLuckyUser={currentLuckyUser} handleSave={() => handleSave(currentLuckyUser)} handleCancel={() => handleCancel()} />
    </div>
  )
}

export default App

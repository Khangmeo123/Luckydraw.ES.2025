import type { PopconfirmProps } from 'antd';
import { Button, message, Popconfirm, Carousel } from 'antd';
import axios from 'axios';
import React, { useEffect } from 'react';
import './App.scss';
import ModalCongratulation from './Components/ModalCongratulation/ModalCongratulation';
import SpinName from './Components/SpinName';
import ModalViewCongratulation from './Components/ModalCongratulation/ModalViewCongratulation';
export interface DataUser {
  Id?: number;
  Email?: string;
  FullName?: string;
  Avatar?: string;
  WishForES?: string;
  Giai?: string;
  Checkin?: number;
  Checkout?: number;
  Department?: string;
  Image?: string;
  isDonate?: boolean;
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

  const [openViewModal, setOpenViewModal] = React.useState<boolean>(false);
  const [bossPrize, setBossPrize] = React.useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = React.useState<boolean>(false);

  const getPartName = React.useCallback((fullName?: string, part?: string) => {
    const fullNameSplit = fullName?.split(' ') || [];
    const fullNameLength = fullNameSplit.length;
    const Ho = fullNameSplit[0];
    const Ten = fullNameSplit[fullNameLength - 1];
    const Dem = fullNameSplit.slice(1, fullNameLength - 1);
    if (part === 'Ten') {
      return Ten;
    }
    if (part === 'Ho') {
      return Ho;
    }
    if (part === 'Dem') {
      return Dem?.length > 0 ? Dem.join(' ') : "_";
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
        const fullNameSplit = user.FullName?.split(' ') || [];
        const fullNameLength = fullNameSplit.length;
        const Ho = fullNameSplit[0];
        const Ten = fullNameSplit[fullNameLength - 1];
        const Dem = fullNameSplit.slice(1, fullNameLength - 1);
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


  const x = document.getElementById("myAudio");
  const y = document.getElementById("myAudio2");

  const handleClickStart = React.useCallback((prize?: string) => {
    setBossPrize('');
    axios.get("http://localhost:5000/get-lucky-user", {
      params: {
        prize: prize,
        isDonate: prize ? true : false
      }
    }).then(response => {
      if (typeof response.data === "string") {
        message.error(response.data);
      } else {
        (x as HTMLAudioElement).currentTime = 0;
        (x as HTMLAudioElement)?.play();
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
              (x as HTMLAudioElement)?.pause();
              (y as HTMLAudioElement).currentTime = 0;
              (y as HTMLAudioElement)?.play();
            }, 500);
          }, 1000);
        }, 1200);
      }
    })
  }, [getPartName, x, y]);

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

  function toBoolean(value?: string | boolean) {
    return value === 'true' || value === true
  }
  const giaiThuong = React.useMemo(() => {
    const giai5M = listLuckyUser.filter(user => user.Giai === '5M' && !toBoolean(user.isDonate))[0];
    console.log(listLuckyUser);
    const danhSachGiai2M = listLuckyUser.filter(user => user.Giai === '2M' && !toBoolean(user.isDonate));
    const danhSachGiai1M = listLuckyUser.filter(user => user.Giai === '1M' && !toBoolean(user.isDonate));
    const danhSachGiai500k = listLuckyUser.filter(user => user.Giai === '500k' && !toBoolean(user.isDonate));
    const danhSachGiaiBoss = listLuckyUser.filter(user => toBoolean(user.isDonate));
    const soGiaiChinh = listLuckyUser?.filter(p => !toBoolean(p?.isDonate))?.length;
    return {
      giai5M,
      danhSachGiai2M,
      danhSachGiai1M,
      danhSachGiai500k,
      danhSachGiaiBoss,
      soGiaiChinh,
    }
  }, [listLuckyUser]);

  const handleClickView = (giai: DataUser) => {
    setOpenViewModal(true);
    setCurrentLuckyUser(giai);
  }

  const handleCloseView = () => {
    setOpenViewModal(false);
    setCurrentLuckyUser({});
  }



  return (
    <div className='app-container'>

      <div className='app-background'>
      </div>
      <div className='app-content'>
        <div className='app-block-draw'>
          <div className='app-block-name'>
            <div className='app-block-each-name' style={{ borderColor: fakingLuckyUser?.Ho ? '#24e0ff' : 'gray' }}>
              <div className='draw-name'>
                <SpinName playing={playing} listData={listHo} valueSelected={fakingLuckyUser?.Ho} placeholder='Họ' />
              </div>
            </div>
            <div className='app-block-each-name' style={{ borderColor: fakingLuckyUser?.Dem ? '#24e0ff' : 'gray' }}>
              <div className='draw-name'> <SpinName playing={playing} listData={listDem} valueSelected={fakingLuckyUser?.Dem} placeholder="Đệm" /></div>
            </div>
            <div className='app-block-each-name' style={{ borderColor: fakingLuckyUser?.Ten ? '#24e0ff' : 'gray' }}>
              <div className='draw-name'><SpinName playing={playing} listData={listTen} valueSelected={fakingLuckyUser?.Ten} placeholder="Tên" /></div>
            </div>
          </div>


        </div>
        <div className="list-lucky-user">
          <Carousel dots>
            <>
              <div className='title'>DANH SÁCH TRÚNG THƯỞNG</div>
              <div className="list-user">

                <div className='each-prize'>
                  <div className="name-prize" style={{ color: 'red' }}>
                    Giải 5M
                  </div>
                  <div className='user-prize-list user-best-prize-container'>
                    {giaiThuong.giai5M && (
                      <div className='winner-tag' onClick={() => handleClickView(giaiThuong.giai5M)}>
                        {giaiThuong.giai5M?.FullName}
                      </div>
                    )}
                  </div>
                </div>
                <div className='each-prize'>
                  <div className="name-prize">
                    Giải 2M
                  </div>
                  <div className='user-prize-list'>
                    {giaiThuong.danhSachGiai2M.map((user, index) => (
                      <div key={index} className='winner-tag' onClick={() => handleClickView(user)}>
                        {user?.FullName}
                      </div>
                    ))}
                  </div>
                </div>
                <div className='each-prize'>
                  <div className="name-prize">
                    Giải 1M
                  </div>
                  <div className='user-prize-list'>
                    {giaiThuong.danhSachGiai1M.map((user, index) => (
                      <div key={index} className='winner-tag' onClick={() => handleClickView(user)}>
                        {user?.FullName}
                      </div>
                    ))}
                  </div>
                </div>
                <div className='each-prize'>
                  <div className="name-prize">
                    Giải 500k
                  </div>
                  <div className='user-prize-list'>
                    {giaiThuong.danhSachGiai500k.map((user, index) => (
                      <div key={index} className='winner-tag' onClick={() => handleClickView(user)}>
                        {user?.FullName}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="footer-action-draw">
                <div className='random-button' >
                  <Button type="primary" size='large' disabled={playing || giaiThuong?.soGiaiChinh >= 36} onClick={() => handleClickStart()}>Quay thưởng</Button>
                </div>
              </div></>
            <>
              <div className='title'>DANH SÁCH TRÚNG THƯỞNG DONATE</div>
              <div className="list-user">
                <div className='boss-input-section'>
                  <input
                    placeholder="Nhập tên giải thưởng Boss tặng..."
                    value={bossPrize}
                    onChange={(e) => setBossPrize(e.target.value)}
                  />
                </div>
                {giaiThuong.danhSachGiaiBoss.length > 0 && (
                  <div className='each-prize' style={{ border: 'none', margin: '20px 0px' }} >
                    <div className='user-prize-list' style={{ backgroundColor: '#fffefc' }}>
                      {giaiThuong.danhSachGiaiBoss.map((user, index) => (
                        <div key={index} className='winner-tag' style={{ borderColor: 'orange', color: '#d46b08', background: '#fff7e6' }} onClick={() => handleClickView(user)}>
                          <strong>{user.Giai}:</strong> {user?.FullName}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="footer-action-draw">
                <div className='random-button' >
                  <Button type="primary" size='large' disabled={playing} onClick={() => handleClickStart(bossPrize)}>Quay thưởng</Button>
                </div>
              </div>
            </>
            <div className="footer-action-reset">
              <Popconfirm
                title="Reset dữ liệu"
                description="Bạn có chắc chắn muốn reset dữ liệu?"
                onConfirm={confirm}
                okText="Xác nhận"
                cancelText="Huỷ"


              >
                <Button danger size='large'>Reset</Button>
              </Popconfirm>
            </div>

          </Carousel>
        </div>
      </div>
      <ModalCongratulation isOpen={openModal} currentLuckyUser={currentLuckyUser} handleSave={() => handleSave(currentLuckyUser)} handleCancel={() => handleCancel()} />
      <ModalViewCongratulation isOpen={openViewModal} currentLuckyUser={currentLuckyUser} handleCancel={() => handleCloseView()} />
      <audio id="myAudio">
        <source src="./Bia.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <audio id="myAudio2">
        <source src="./Votay.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div >
  )
}

export default App

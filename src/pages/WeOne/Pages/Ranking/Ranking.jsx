import React, { useEffect, useState } from 'react';
import Layout from '../../Components/Layout';
import { LeftArrowIcon } from '../../../../component/Icons';
import { Button, Avatar, Badge, Divider } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { CrowKingColorIcon, MedalColorIcon, Medal3ColorIcon } from '../../../../component/Icons';
import { useAppContext } from '../../../../contexts/AppContext';
import fetchProtectedData from '../../../../../utils/fetchData';
import UserProfileAvatar from '../../../../component/UserProfileAvatar';
import { URLS } from '../../../../config';

function Ranking() {
    const navigate = useNavigate();
    const [userProfile, setUserProfile] = useState(null); // For self user
    const [usersRankingData, setUsersRankingData] = useState([]); // For other users
    const currentData = useAppContext();

    useEffect(() => {
        // Fetch ranking data from the API
        const fetchRankings = async () => {
            try {
                const response = await fetchProtectedData.get(`${URLS.weOne.getRanking}`, {
                    params:
                    {
                        username: currentData.currentUser.userName
                    }, // Replace with actual username
                });

                // Extract self and rankings data
                const { self, rankings } = response.data;

                // Update state with fetched data
                setUserProfile(self);
                setUsersRankingData(rankings);
            } catch (error) {
                console.error('Error fetching rankings:', error);
            }
        };

        fetchRankings();
    }, []);

    const renderIconForRank = (rank) => {
        switch (rank) {
            case 1:
                return <CrowKingColorIcon width={20} height={20} />;
            case 2:
                return <MedalColorIcon width={20} height={20} />;
            case 3:
                return <Medal3ColorIcon width={20} height={20} />;
            default:
                return null;
        }
    };

    return (
        <Layout>
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <Button isIconOnly variant="light" className="flex-shrink-0" onPress={() => navigate(-1)}>
                        <LeftArrowIcon width={16} />
                    </Button>
                    <h2 className="text-xl font-bold flex-grow text-center">อันดับ</h2>
                    <span className="w-8"></span>
                </div>
                {userProfile && (
                    <section className="flex items-center space-x-4 bg-[#e4f2ff] p-4 rounded-lg">
                        <UserProfileAvatar
                            name={userProfile.username}
                            size="lg"
                            imageURL={userProfile.displayImgUrl}
                            className="text-sm flex-shrink-0"
                        />
                        <div className="flex-grow">
                            <p className="text-md font-semibold">{userProfile.username || 'ไม่พบผู้ใช้'}</p>
                            <p className="text-lg font-bold text-gray-800">{userProfile.rank ? `อันดับที่ ${userProfile.rank}` : 'ไม่ได้อยู่ในอันดับ'}</p>
                            <p className="font-semibold">
                                <span className="text-blue-600">{userProfile.total_points || 0}</span>
                                <span className="text-black"> คะแนน</span>
                            </p>
                        </div>
                    </section>
                )}
                <h3 className="text-lg font-semibold">อันดับคะแนนผู้ใช้ ({usersRankingData.length})</h3>

                <div className="flex flex-col max-h-[calc(100vh-200px)] overflow-hidden">
                    <section className="flex-grow space-y-4 overflow-y-auto pb-16 scrollbar-hide">
                        {usersRankingData.map((user, index) => (
                            <div key={index}>
                                <div className="flex items-center justify-between p-2">
                                    <div className="flex items-center space-x-4">
                                        <span className="text-lg font-bold">{user.rank}</span>
                                        <UserProfileAvatar
                                            name={user.username}
                                            imageURL={user.displayImgUrl}
                                            size="lg"
                                            className="border-2 border-white text-sm flex-shrink-0" />
                                        <div className="flex items-center space-x-2">
                                            <p className="font-semibold text-md">{user.username}</p>
                                            {renderIconForRank(user.rank)}
                                        </div>
                                    </div>
                                    <p className="font-semibold">
                                        <span className="text-blue-600">{user.total_points}</span>
                                        <span className="text-black"> คะแนน</span>
                                    </p>
                                </div>
                                {index < usersRankingData.length - 1 && <Divider />}
                            </div>
                        ))}
                    </section>
                </div>
            </div>
        </Layout>
    );
}

export default Ranking;

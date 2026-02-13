import { Composition } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { StatsVideo } from "./StatsVideo";
import { PropertyShowcase } from "./PropertyShowcase";
import { NismaraUmaAd } from "./NismaraUmaAd";
import { MonthlyReportVideo } from "./MonthlyReportVideo";
import { OverviewDashboardVideo } from "./OverviewDashboardVideo";
import { CompleteOverviewVideo } from "./CompleteOverviewVideo";
import { NismaraVilla } from "./NismaraVilla";
import { LtxPromo } from "./LtxPromo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Demo Video - Simple Hello World */}
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          titleText: "Welcome to MY HOST BizMate",
          titleColor: "#FF8C42",
        }}
      />

      {/* Stats Video - Show booking statistics */}
      <Composition
        id="StatsVideo"
        component={StatsVideo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          totalBookings: 41,
          totalRevenue: 140709985,
          airbnbBookings: 34,
          bookingComBookings: 3,
          directBookings: 3,
        }}
      />

      {/* Property Showcase - Feature a villa */}
      <Composition
        id="PropertyShowcase"
        component={PropertyShowcase}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          propertyName: "Nismara Uma Villa",
          location: "Ubud, Bali",
          bedrooms: 2,
          price: "Rp 3,500,000 /night",
        }}
      />

      {/* Nismara Uma Ad - 30s Professional Video Ad */}
      <Composition
        id="NismaraUmaAd"
        component={NismaraUmaAd}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Monthly Report - Automated monthly performance video */}
      <Composition
        id="MonthlyReport"
        component={MonthlyReportVideo}
        durationInFrames={1350}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          month: "February",
          year: 2026,
          totalBookings: 41,
          totalRevenue: 140709985,
          airbnbBookings: 34,
          airbnbRevenue: 103701906,
          bookingComBookings: 3,
          bookingComRevenue: 21008079,
          directBookings: 3,
          directRevenue: 16000000,
          occupancyRate: 68.3,
          avgBookingValue: 3431951,
          topPerformer: "Nismara Uma Villa",
        }}
      />

      {/* Overview Dashboard - Complete business overview video */}
      <Composition
        id="OverviewDashboard"
        component={OverviewDashboardVideo}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          totalProperties: 12,
          totalBookings: 156,
          totalRevenue: 540000000,
          occupancyRate: 72.3,
          avgNightlyRate: 3500000,
          avgStayDuration: 4.2,
          activeBookings: 18,
          upcomingCheckIns: 8,
          upcomingCheckOuts: 6,
          averageRating: 4.8,
          totalReviews: 109,
          topProperty: "Nismara Uma Villa",
          topChannel: "Airbnb",
        }}
      />

      {/* Complete Overview - 60s video with ALL sections */}
      <Composition
        id="CompleteOverview"
        component={CompleteOverviewVideo}
        durationInFrames={1800}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          totalRevenue: 140709985,
          totalBookings: 41,
          avgBookingValue: 3431951,
          revenueGrowth: 12.5,
          occupancyRate: 68.3,
          avgNightlyRate: 3500000,
          avgStayDuration: 4.2,
          totalNights: 172,
          monthlyRevenue: [20000000, 22000000, 25000000, 23000000, 24000000, 26709985],
          monthlyOccupancy: [65, 68, 72, 69, 70, 68.3],
          topProperties: [
            { name: "Nismara Uma Villa", bookings: 25, revenue: 87500000, occupancy: 75.2 },
            { name: "Graha Uma Villa", bookings: 10, revenue: 35000000, occupancy: 60.5 },
            { name: "Villa Serenity", bookings: 6, revenue: 18209985, occupancy: 45.8 },
          ],
          airbnbBookings: 34,
          airbnbRevenue: 103701906,
          bookingComBookings: 3,
          bookingComRevenue: 21008079,
          directBookings: 3,
          directRevenue: 16000000,
          pendingPayments: 3,
          completedPayments: 35,
          failedPayments: 3,
          pendingAmount: 12000000,
          completedAmount: 128709985,
          generatedDate: "February 8, 2026",
        }}
      />

      {/* Nismara Villa - Complete promotional video with photos */}
      <Composition
        id="NismaraVilla"
        component={NismaraVilla}
        durationInFrames={1590}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          data: {
            metrics: {
              totalBookings: 41,
              totalRevenueM: "139.9",
              avgBookingValueM: "3.4",
              avgLengthOfStay: "3.5",
            },
            performance2025: {
              occupancy: "65",
            },
            performance2026: {
              occupancy: "27",
            },
          },
        }}
      />

      {/* LTX-2 Promo - AI-generated cinematic clips with branding */}
      <Composition
        id="LtxPromo"
        component={LtxPromo}
        durationInFrames={300}  // 6 seconds at 50 FPS
        fps={50}
        width={1920}
        height={1080}
        defaultProps={{
          musicFile: 'background-music.mp3',
        }}
      />

      {/* LTX-2 Promo with Bali Sunrise music for MyHost Bizmate */}
      <Composition
        id="LtxPromoBaliSunrise"
        component={LtxPromo}
        durationInFrames={300}  // 6 seconds at 50 FPS
        fps={50}
        width={1920}
        height={1080}
        defaultProps={{
          musicFile: 'bali-sunrise.mp3',
        }}
      />
    </>
  );
};

import { fetchBookingsData } from "@/repository/booking.repository";
import Booking from "@/sequilizedir/models/booking.model";
import { generalResponse } from "@/utils/generalResponse";
import { Request, Response } from "express";

const AdminDashboard = async (req: Request, res: Response) => {
  const { checkInDate } = req.query;
  try{
    const bookings: Booking[] | null = await fetchBookingsData(checkInDate as string);
    return generalResponse(
      req,
      res,
      bookings,
      "Booking List fetched successfully",
      false,
    );
  } catch (error) {
    return generalResponse(req, res, null, "Failed to fetch booking list", false, "error", 500);
  }
  
};

export { AdminDashboard };
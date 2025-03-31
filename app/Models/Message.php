<?php

namespace App\Models;

use App\Observers\MessageObserver;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'message',
        'sender_id',
        'group_id',
        'receiver_id',
    ];
    
    /**
     * The "booted" method of the model.
     *
     * @return void
     */
    protected static function booted()
    {
        static::observe(MessageObserver::class);
    }
    
    public function sender(){
        return $this->belongsTo(User::class, 'sender_id');
    }
    
    public function receiver(){
        return $this->belongsTo(User::class, 'receiver_id');
    }
    
    public function group(){
        return $this->belongsTo(Group::class);
    }
    
    public function attachments(){
        return $this->hasMany(MessageAttachment::class);
    }
}
